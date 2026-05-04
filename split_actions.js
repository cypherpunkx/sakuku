const fs = require('fs');
const path = require('path');

const actionsPath = path.join(__dirname, 'lib', 'actions.ts');
const actionsDir = path.join(__dirname, 'lib', 'actions');

if (!fs.existsSync(actionsDir)) {
  fs.mkdirSync(actionsDir);
}

const content = fs.readFileSync(actionsPath, 'utf8');

const imports = `"use server";

import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and, desc, sql, or, like, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const CURRENT_USER_ID = "user_1";
`;

function extractFunction(content, funcName) {
  const startRegex = new RegExp(`(export\\s+async\\s+function\\s+${funcName}\\s*\\(|async\\s+function\\s+${funcName}\\s*\\()`);
  const match = content.match(startRegex);
  if (!match) return null;
  
  let startIdx = match.index;
  
  // Find matching brace
  let braceCount = 0;
  let inString = false;
  let stringChar = '';
  let idx = startIdx;
  let started = false;
  
  while (idx < content.length) {
    const char = content[idx];
    
    // Handle strings
    if ((char === '"' || char === "'" || char === '\`') && content[idx-1] !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }
    
    if (!inString) {
      if (char === '{') {
        braceCount++;
        started = true;
      } else if (char === '}') {
        braceCount--;
        if (started && braceCount === 0) {
          return content.substring(startIdx, idx + 1);
        }
      }
    }
    idx++;
  }
  return null;
}

const groupings = {
  'dashboard.actions.ts': ['getUser', 'getDashboardData', 'getStatisticsData'],
  'transaction.actions.ts': ['addTransaction', 'updateTransaction', 'deleteTransaction', 'addCategory', 'deleteCategory', 'updateCategory'],
  'budget.actions.ts': ['upsertBudget', 'resetBudgets'],
  'bill.actions.ts': ['payBill', 'addBill', 'deleteBill'],
  'saving.actions.ts': ['addSavingGoal', 'updateSavingGoal', 'deleteSavingGoal', 'addSavingContribution'],
  'learning.actions.ts': ['getLearningData', 'toggleArticleProgress', 'toggleBookmark', 'fetchExternalNews']
};

for (const [filename, funcNames] of Object.entries(groupings)) {
  let fileContent = imports + '\n';
  
  // For dashboard.actions, we need getUser
  if (filename !== 'dashboard.actions.ts' && funcNames.some(f => !['getUser'].includes(f))) {
     // Check if we need getUser in other files
     let needsGetUser = false;
     for (const funcName of funcNames) {
       const funcContent = extractFunction(content, funcName);
       if (funcContent && funcContent.includes('getUser(')) {
         needsGetUser = true;
       }
     }
     if (needsGetUser) {
       fileContent += 'import { getUser } from "./dashboard.actions";\n\n';
     }
  }

  for (const funcName of funcNames) {
    const funcContent = extractFunction(content, funcName);
    if (funcContent) {
      fileContent += funcContent + '\n\n';
    } else {
      console.log(`Function not found: ${funcName}`);
    }
  }
  
  fs.writeFileSync(path.join(actionsDir, filename), fileContent);
  console.log(`Created ${filename}`);
}

// Now replace lib/actions.ts
const barrelContent = `"use server";

export * from "./actions/dashboard.actions";
export * from "./actions/transaction.actions";
export * from "./actions/budget.actions";
export * from "./actions/bill.actions";
export * from "./actions/saving.actions";
export * from "./actions/learning.actions";
`;

fs.writeFileSync(actionsPath, barrelContent);
console.log('Replaced lib/actions.ts with barrel file.');
