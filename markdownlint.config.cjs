module.exports = {
  default: true,
  MD013: false, // 文の長さはtextlintでチェックするため無効化
  MD026: false, // 本文の句読点ルールはtextlintに任せるため（見出しの末尾の「！」「？」なども許可）
  MD041: false, // ZennのFront Matterがあるため無効化
};
