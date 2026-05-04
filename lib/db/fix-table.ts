import Database from 'better-sqlite3';

const db = new Database('sqlite.db');

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS "savings_goals" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "name" text NOT NULL,
      "target_amount" integer NOT NULL,
      "current_amount" integer DEFAULT 0,
      "icon_name" text DEFAULT 'Target',
      "color" text DEFAULT '#10b981',
      "due_date" text,
      "user_id" text,
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE no action
    );
  `);
  console.log('Table savings_goals verified/created');

  // Add goal_id to transactions if not exists
  try {
    db.exec(`ALTER TABLE "transactions" ADD COLUMN "goal_id" integer REFERENCES "savings_goals"("id")`);
    console.log('Column goal_id added to transactions');
  } catch (err) {
    // Column might already exist
    console.log('Column goal_id might already exist, skipping...');
  }

  // Disable FK checks to allow dropping tables with relations
  db.exec('PRAGMA foreign_keys = OFF;');

  // Recreate articles table to ensure latest schema
  db.exec(`DROP TABLE IF EXISTS "articles"`);
  db.exec(`
    CREATE TABLE "articles" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "title" text NOT NULL,
      "content" text,
      "category" text NOT NULL,
      "read_time" text DEFAULT '5 min',
      "video_url" text,
      "color" text DEFAULT 'primary',
      "featured" integer DEFAULT 0
    );
  `);
  console.log('Table articles recreated with latest schema');

  db.exec(`DROP TABLE IF EXISTS "user_learning_progress";`);
  db.exec(`DROP TABLE IF EXISTS "user_bookmarks";`);

  // Add learning progress table
  db.exec(`
    CREATE TABLE IF NOT EXISTS "user_learning_progress" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "user_id" text NOT NULL,
      "article_id" integer NOT NULL,
      "completed_at" text NOT NULL,
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
    );
  `);
  console.log('Table user_learning_progress verified/created');

  // Add bookmarks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS "user_bookmarks" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "user_id" text NOT NULL,
      "article_id" integer NOT NULL,
      "created_at" text NOT NULL,
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
    );
  `);
  console.log('Table user_bookmarks verified/created');

  // Re-enable FK checks
  db.exec('PRAGMA foreign_keys = ON;');

} catch (err) {
  console.error('Error fixing database:', err);
} finally {
  db.close();
}
