
module.exports = {
  branches: ['main'],
  repositoryUrl: 'https://github.com/andradeg-luiza/donna',
  plugins: [
    '@semantic-release/commit-analyzer', // Lê os commits e decide o tipo de release
    '@semantic-release/release-notes-generator', // Gera notas de release
    '@semantic-release/changelog', // Atualiza CHANGELOG.md
    '@semantic-release/npm', // Atualiza versão no package.json (sem publicar se não quiser)
    '@semantic-release/git', // Faz commit de CHANGELOG.md + package.json
    '@semantic-release/github', // Cria release no GitHub
  ],
  preset: 'conventionalcommits',
  changelogFile: 'CHANGELOG.md',
};
