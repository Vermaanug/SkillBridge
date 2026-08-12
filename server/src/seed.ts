/**
 * Loads the seed dataset into CognoDB.
 * Every statement is parameterized (no string-concatenated Cypher) and uses
 * MERGE, so running this script twice is safe and won't create duplicates.
 *
 * Usage: npm run seed
 */
import { runQuery, closeDriver, verifyConnection } from "./db";
import { skills, jobs, people, hasSkill, requires, relatedTo } from "./data/seedData";

async function main() {
  const health = await verifyConnection();
  if (!health.ok) {
    console.error(`Cannot reach CognoDB: ${health.error}`);
    console.error("Check COGNODB_URI / COGNODB_USER / COGNODB_PASSWORD in your .env file.");
    process.exit(1);
  }

  console.log("Connected. Creating constraints...");
  await runQuery("CREATE CONSTRAINT skill_id IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE");
  await runQuery("CREATE CONSTRAINT job_id IF NOT EXISTS FOR (j:Job) REQUIRE j.id IS UNIQUE");
  await runQuery("CREATE CONSTRAINT person_id IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE");

  console.log(`Loading ${skills.length} skills...`);
  await runQuery(
    `UNWIND $rows AS row
     MERGE (s:Skill {id: row.id})
     SET s.name = row.name, s.category = row.category`,
    { rows: skills }
  );

  console.log(`Loading ${jobs.length} jobs...`);
  await runQuery(
    `UNWIND $rows AS row
     MERGE (j:Job {id: row.id})
     SET j.title = row.title, j.company = row.company,
         j.location = row.location, j.description = row.description`,
    { rows: jobs }
  );

  console.log(`Loading ${people.length} people...`);
  await runQuery(
    `UNWIND $rows AS row
     MERGE (p:Person {id: row.id})
     SET p.name = row.name, p.headline = row.headline`,
    { rows: people }
  );

  console.log(`Loading ${hasSkill.length} HAS_SKILL relationships...`);
  await runQuery(
    `UNWIND $rows AS row
     MATCH (p:Person {id: row.personId}), (s:Skill {id: row.skillId})
     MERGE (p)-[r:HAS_SKILL]->(s)
     SET r.level = row.level`,
    { rows: hasSkill }
  );

  console.log(`Loading ${requires.length} REQUIRES relationships...`);
  await runQuery(
    `UNWIND $rows AS row
     MATCH (j:Job {id: row.jobId}), (s:Skill {id: row.skillId})
     MERGE (j)-[r:REQUIRES]->(s)
     SET r.importance = row.importance`,
    { rows: requires }
  );

  console.log(`Loading ${relatedTo.length} RELATED_TO relationships...`);
  await runQuery(
    `UNWIND $rows AS row
     MATCH (a:Skill {id: row.a}), (b:Skill {id: row.b})
     MERGE (a)-[r:RELATED_TO]->(b)
     SET r.weight = row.weight`,
    { rows: relatedTo }
  );

  console.log("Seed complete.");
  await closeDriver();
}

main().catch(async (err) => {
  console.error("Seed failed:", err);
  await closeDriver();
  process.exit(1);
});
