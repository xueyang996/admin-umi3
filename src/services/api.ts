export default {
  queryTableList: 'http://yapi.ii-ai.tech/mock/359/table', // 奖励详情页内容
  getItem: 'http://yapi.ii-ai.tech/mock/359/getItem', // 奖励详情页内容
  queryCollect: 'post /smurfs/collect', // 收藏
  queryCancel: 'post /smurfs/collect/cancel', // 取消收藏
  queryPolicyRewardList: '/smurfs/match/result/reward/{id}',
  queryRewardDetailInfo: '/smurfs/match/result/reward/{id}/{rewardId}', // 获取奖励详情页列表内容
  queryCompleteInfo: '/smurfs/applier/single/policy/tag/supply', // 单政策标签编辑接口
  queryRewardMatch: 'post /smurfs/match', // 奖励匹配(信息完善)
  queryInfoCenterList: 'post /smurfs/msg/selectListPage/{size}/{page}', // 获取信息中心的列表页
};
