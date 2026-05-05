"use server";

import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and, desc, sql, or, like, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const CURRENT_USER_ID = "user_1";

export async function getLearningData(search: string = "") {
  const articles = await db
    .select()
    .from(schema.articles)
    .where(
      search
        ? or(
            like(schema.articles.title, `%${search}%`),
            like(schema.articles.content, `%${search}%`),
            like(schema.articles.category, `%${search}%`),
          )
        : undefined,
    );

  const externalNews = await fetchExternalNews(search);
  const allAvailableArticles = [...articles, ...externalNews];

  // Filter for search if search exists
  const filteredArticles = search
    ? allAvailableArticles.filter(
        (a) =>
          a.title?.toLowerCase().includes(search.toLowerCase()) ||
          a.category?.toLowerCase().includes(search.toLowerCase()) ||
          a.content?.toLowerCase().includes(search.toLowerCase()),
      )
    : allAvailableArticles;

  const user = await db.query.users.findFirst();

  // Simple "Pain Point" analysis
  // 1. Get top expense category for this month
  const today = new Date();
  const yearMonth = today.toISOString().substring(0, 7); // YYYY-MM

  const topCategory = await db
    .select({
      name: schema.categories.name,
      total: sql<number>`sum(${schema.transactions.amount})`,
    })
    .from(schema.transactions)
    .innerJoin(
      schema.categories,
      eq(schema.transactions.categoryId, schema.categories.id),
    )
    .where(
      and(
        eq(schema.transactions.type, "expense"),
        like(schema.transactions.date, `${yearMonth}%`),
      ),
    )
    .groupBy(schema.categories.id)
    .orderBy(sql`sum(${schema.transactions.amount}) desc`)
    .limit(1);

  const mainCategory = topCategory[0]?.name || "Umum";

  // Get completed articles for this user
  const completedProgress = await db
    .select()
    .from(schema.userLearningProgress)
    .where(eq(schema.userLearningProgress.userId, CURRENT_USER_ID));

  const completedIds = completedProgress.map((p) => p.articleId);

  // Get bookmarks for this user
  const bookmarks = await db
    .select()
    .from(schema.userBookmarks)
    .where(eq(schema.userBookmarks.userId, CURRENT_USER_ID));

  const bookmarkedIds = bookmarks.map((b) => b.articleId);

  // Calculate dynamic topics
  const topicCounts = allAvailableArticles.reduce(
    (acc, art) => {
      acc[art.category] = (acc[art.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topics = Object.entries(topicCounts).map(([name, count]) => ({
    name,
    count,
  }));

  // Recommended Article - PRIORITIZE INTERNAL CURRICULUM
  let recommendedArticle =
    articles.find((a) => a.category === mainCategory) ||
    articles.find((a) => a.category === "Umum") ||
    externalNews.find(
      (a: { category: string }) => a.category === mainCategory,
    ) ||
    allAvailableArticles[0];

  // INJECT REAL FINANCIAL DATA INTO RECOMMENDED CONTENT
  if (recommendedArticle && topCategory[0]) {
    const { total, name } = topCategory[0];
    const formattedTotal = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(total);

    const personalizedInsight = `📊 ANALISIS PERSONAL: Bulan ini Anda telah menghabiskan ${formattedTotal} untuk kategori "${name}".\n\nBerdasarkan perhitungan sistem SakuKu, kategori ini menjadi pengeluaran tertinggi Anda. Pelajari materi di bawah ini untuk membantu Anda mengelola pengeluaran tersebut dengan lebih bijak.\n\n---\n\n`;

    // We clone to avoid modifying the original object in cache if any
    recommendedArticle = {
      ...recommendedArticle,
      content: personalizedInsight + (recommendedArticle.content || ""),
    };
  }

  return {
    articles: filteredArticles
      .filter((a) => a.id !== recommendedArticle?.id)
      .map((a) => ({
        ...a,
        isCompleted: completedIds.includes(a.id),
        isBookmarked: bookmarkedIds.includes(a.id),
      })),
    recommended: recommendedArticle
      ? {
          ...recommendedArticle,
          isCompleted: completedIds.includes(recommendedArticle.id),
          isBookmarked: bookmarkedIds.includes(recommendedArticle.id),
        }
      : null,
    topCategory: mainCategory,
    user,
    completedCount: completedIds.length,
    totalCount: allAvailableArticles.length,
    topics,
  };
}

export async function toggleArticleProgress(articleId: number) {
  const existing = await db
    .select()
    .from(schema.userLearningProgress)
    .where(
      and(
        eq(schema.userLearningProgress.userId, CURRENT_USER_ID),
        eq(schema.userLearningProgress.articleId, articleId),
      ),
    );

  if (existing.length > 0) {
    await db
      .delete(schema.userLearningProgress)
      .where(
        and(
          eq(schema.userLearningProgress.userId, CURRENT_USER_ID),
          eq(schema.userLearningProgress.articleId, articleId),
        ),
      );
  } else {
    await db.insert(schema.userLearningProgress).values({
      userId: CURRENT_USER_ID,
      articleId,
      completedAt: new Date().toISOString(),
    });
  }

  revalidatePath("/dashboard", "layout");
}

export async function toggleBookmark(articleId: number) {
  const existing = await db
    .select()
    .from(schema.userBookmarks)
    .where(
      and(
        eq(schema.userBookmarks.userId, CURRENT_USER_ID),
        eq(schema.userBookmarks.articleId, articleId),
      ),
    );

  if (existing.length > 0) {
    await db
      .delete(schema.userBookmarks)
      .where(
        and(
          eq(schema.userBookmarks.userId, CURRENT_USER_ID),
          eq(schema.userBookmarks.articleId, articleId),
        ),
      );
  } else {
    await db.insert(schema.userBookmarks).values({
      userId: CURRENT_USER_ID,
      articleId,
      createdAt: new Date().toISOString(),
    });
  }

  revalidatePath("/dashboard", "layout");
}

async function fetchExternalNews(search: string = "") {
  const API_KEY = process.env.NEWS_API_KEY;
  if (!API_KEY) {
    console.warn("NewsAPI Key is missing in environment variables.");
    return [];
  }
  
  // Jika ada pencarian, gunakan kata kunci pencarian + konteks keuangan
  // Jika tidak, gunakan kueri default
  const query = search 
    ? encodeURIComponent(`(${search}) AND (keuangan OR bisnis OR investasi OR tabungan OR bank)`)
    : encodeURIComponent("keuangan OR investasi OR tabungan");

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&language=id&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`,
      { next: { revalidate: 3600 } }, // Cache selama 1 jam
    );

    const data = await response.json();

    if (data.status !== "ok") {
      console.error("NewsAPI Error:", data.message);
      return [];
    }

    return data.articles.map((art: any, index: number) => {
      const words = (art.description || art.content || "").split(" ").length;
      const readMinutes = Math.max(1, Math.ceil(words / 200));

      return {
        id: 2000 + index,
        title: art.title,
        content:
          art.description ||
          art.content ||
          "Klik untuk membaca selengkapnya...",
        category: "Berita",
        readTime: `${readMinutes} mnt baca`,
        color: index % 2 === 0 ? "indigo" : "blue",
        isExternal: true,
        url: art.url,
        imageUrl: art.urlToImage,
        source: art.source?.name,
      };
    });
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
}

