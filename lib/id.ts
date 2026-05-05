import Snowflake from "snowflake-id";

const snowflake = new Snowflake({
  mid: 42, // Machine ID
  offset: (2026 - 1970) * 31536000 * 1000, // Custom offset for SakuKu
});

export function generateId() {
  return snowflake.generate().toString();
}
