const { execSync } = require('child_process');
const pkg = require('../package.json');

const version = pkg.version;

try
{
  execSync(`git commit -am "chore(release): bump version to ${version}"`, { stdio: 'inherit' });
  execSync(`git push`, { stdio: 'inherit' });
} catch (err)
{
  console.error("❌ Gagal tagging versi:", err.message);
  process.exit(1);
}
