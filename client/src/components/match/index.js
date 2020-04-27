import { useState, useEffect } from "react";
import { api } from "../../api/summoner";

const Match = async (accountId, summonerName) => {
  let matchList;
  let matchInfo;
  let sum = 0;
  let gameCnt = 0;
  let finalScore;
  let rankInfo = [];
  let isTroll = "";
  const championInfo = await api.getChampionInfo();

  const getMatchList = async () => {
    try {
      matchList = await api.getMatchList(accountId).then(async (res) => {
        // console.log(res);
        for (let cnt = 0; cnt < 20; cnt++) {
          matchInfo = await api.getMatchInfo(res.matches[cnt].gameId);
          if (
            matchInfo.gameMode === "CLASSIC" &&
            matchInfo.gameDuration >= 800
          ) {
            let lane = res.matches[cnt].lane;
            console.log(res.matches[cnt]);
            // console.log(matchInfo);
            console.log("라인 : ", lane);
            gameCnt++;
            // temp = deathNote Rank 와 win 의 정보가 담겨있다.
            let rank = await deathNote(matchInfo, accountId);
            // let win = temp.win;
            // let rank = temp.deathNoteRank;

            if (rank.win) {
              sum = sum + rank.deathNoteRank;
            } else {
              sum = sum + (rank.deathNoteRank - 1);
            }
            let championImg;
            Object.keys(championInfo).forEach((key) => {
              if (
                championInfo[key].key === res.matches[cnt].champion.toString()
              ) {
                const imgSrc = `https://ddragon.leagueoflegends.com/cdn/10.8.1/img/champion/${key}.png`;
                // 챔피언의 key와 그에 따른 챔피언 이미지를 champion 객체에 추가시켜줍니다.
                championImg = imgSrc;
              }
            });
            rankInfo.push({
              dealRank: rank.dealRank,
              tankRank: rank.tankRank,
              visionRank: rank.visionRank,
              towerDealRank: rank.towerDealRank,
              kdaScoreRank: rank.kdaScoreRank,
              champion: res.matches[cnt].champion,
              deathNoteRank: rank.deathNoteRank,
              kills: rank.kills,
              deaths: rank.deaths,
              assists: rank.assists,
              win: rank.win,
              championImg: championImg,
            });
          }

          // // result = sum / gameCnt;
          // // return result;

          // console.log(cnt);
        }
        // console.log(sum);
        // console.log(gameCnt);
        finalScore = (11 - (sum / gameCnt) * 1.0) * 10;
        finalScore = Math.round(finalScore);

        if (finalScore <= 20) {
          isTroll = '"만나면 필히 닷지하세요."';
        } else if (finalScore <= 40) {
          isTroll = '"개트롤입니다."';
        } else if (finalScore <= 50) {
          isTroll = '"트롤러입니다."';
        } else if (finalScore <= 60) {
          isTroll = '"딱! 현지인"';
        } else if (finalScore <= 70) {
          isTroll = '"평타이상입니다."';
        } else if (finalScore <= 80) {
          isTroll = '"버스기사입니다."';
        } else if (finalScore <= 90) {
          isTroll = '"같이하면 꽁승"';
        } else if (finalScore <= 100) {
          isTroll = '"우주비행사급 캐리"';
        }
        // console.log("당신이 경기한 랭크게임 수는 : ", gameCnt, "경기입니다.");
        // console.log("최종스코어는 : ", finalScore, "점입니다.");
      });
    } catch (err) {
      console.log(err);
    }
  };
  await getMatchList();
  let ret = { finalScore: finalScore, rankInfo: rankInfo, isTroll: isTroll };
  console.log(ret);
  return ret;
};

// deathNote Rank 를 리턴하는 함수입니다.
const deathNote = async (matchInfo, accountId) => {
  let participantId = 0;
  for (let i = 0; i < 10; i++) {
    if (matchInfo.participantIdentities[i].player.accountId === accountId) {
      participantId = matchInfo.participantIdentities[i].participantId;
      break;
    }
  }
  let championInfo = await api.getChampionInfo();
  let championName;
  Object.keys(championInfo).forEach((key) => {
    if (
      championInfo[key].key ===
      matchInfo.participants[participantId - 1].championId.toString()
    ) {
      championName = championInfo[key].name;
    }
  });

  let deal = [];
  let tank = [];
  let vision = [];
  let towerDeal = [];
  let kdaScore = [];
  for (let i = 0; i < 10; i++) {
    let kills = matchInfo.participants[i].stats.kills;
    let assists = matchInfo.participants[i].stats.assists;
    let deaths = matchInfo.participants[i].stats.deaths;
    let kda = kills * 3 + assists * 2 - deaths * 2;

    deal.push({
      participantId: matchInfo.participants[i].participantId,
      type: "totalDamageDealtToChampions",
      totalDamageDealtToChampions:
        matchInfo.participants[i].stats.totalDamageDealtToChampions,
    });
    tank.push({
      participantId: matchInfo.participants[i].participantId,
      type: "totalDamageTaken",
      totalDamageTaken: matchInfo.participants[i].stats.totalDamageTaken,
    });
    vision.push({
      participantId: matchInfo.participants[i].participantId,
      type: "visionScore",
      visionScore: matchInfo.participants[i].stats.visionScore,
    });
    towerDeal.push({
      participantId: matchInfo.participants[i].participantId,
      type: "damageDealtToTurrets",
      damageDealtToTurrets:
        matchInfo.participants[i].stats.damageDealtToTurrets,
    });
    kdaScore.push({
      participantId: matchInfo.participants[i].participantId,
      type: "kdaScore",
      kdaScore: kda,
    });
  }
  function compare(a, b) {
    let compareType = a.type;
    if (a[compareType] < b[compareType]) {
      return -1;
    }
    if (a[compareType] > b[compareType]) {
      return 1;
    }
    return 0;
  }
  deal.sort(compare);
  tank.sort(compare);
  vision.sort(compare);
  towerDeal.sort(compare);
  kdaScore.sort(compare);
  let dealRank = [];
  let tankRank = [];
  let visionRank = [];
  let towerDealRank = [];
  let kdaScoreRank = [];
  // console.log("deal량 array:", deal);
  for (let j = 1; j <= 10; j++) {
    for (let i = 0; i < 10; i++) {
      if (deal[i].participantId === j) {
        dealRank.push({
          participantId: j,
          rank: 10 - i,
        });
      }
      if (tank[i].participantId === j) {
        tankRank.push({
          participantId: j,
          rank: 10 - i,
        });
      }
      if (vision[i].participantId === j) {
        visionRank.push({
          participantId: j,
          rank: 10 - i,
        });
      }
      if (towerDeal[i].participantId === j) {
        towerDealRank.push({
          participantId: j,
          rank: 10 - i,
        });
      }
      if (kdaScore[i].participantId === j) {
        kdaScoreRank.push({
          participantId: j,
          rank: 10 - i,
        });
      }
    }
  }
  let deathNoteScore = [];

  let sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = 0;
    sum =
      (11 - dealRank.find((rank) => rank.participantId === i).rank) * 3 +
      (11 - tankRank.find((rank) => rank.participantId === i).rank) * 1 +
      (11 - visionRank.find((rank) => rank.participantId === i).rank) * 1 +
      (11 - towerDealRank.find((rank) => rank.participantId === i).rank) * 2 +
      (11 - kdaScoreRank.find((rank) => rank.participantId === i).rank) * 3;
    deathNoteScore.push({
      participantId: i,
      type: "deathNoteScore",
      deathNoteScore: sum,
    });
  }
  deathNoteScore.sort(compare);
  let deathNoteRank = 0;
  for (let i = 0; i < 10; i++) {
    if (deathNoteScore[i].participantId === participantId) {
      console.log(deathNoteScore[i].deathNoteScore);
      deathNoteRank = 10 - i;
      break;
    }
  }

  // for(let i=0;i<)
  let win = matchInfo.participants[participantId - 1].stats.win;
  let kills = matchInfo.participants[participantId - 1].stats.kills;
  let deaths = matchInfo.participants[participantId - 1].stats.deaths;
  let assists = matchInfo.participants[participantId - 1].stats.assists;

  // if (win === true) {
  //   console.log("게임에서 승리하셨습니다.");
  // } else {
  //   console.log("게임에서 패배하셨습니다.");
  // }
  // console.log(championName, "을 플레이하셨습니다.");
  // console.log("당신의 순서는: ", participantId, "번 째 입니다.");
  // console.log(
  //   "당신의 딜량은: ",
  //   dealRank.find((rank) => rank.participantId === participantId).rank,
  //   "번 째 입니다."
  // );
  // console.log(
  //   "당신의 탱킹은: ",
  //   tankRank.find((rank) => rank.participantId === participantId).rank,
  //   "번 째 입니다."
  // );
  // console.log(
  //   "당신의 시야점수는: ",
  //   visionRank.find((rank) => rank.participantId === participantId).rank,
  //   "번 째 입니다."
  // );
  // console.log(
  //   "당신의 타워딜량은: ",
  //   towerDealRank.find((rank) => rank.participantId === participantId).rank,
  //   "번 째 입니다."
  // );
  // console.log(
  //   "당신의 kdaScore는: ",
  //   kdaScoreRank.find((rank) => rank.participantId === participantId).rank,
  //   "번 째 입니다."
  // );
  // console.log("deathNoteRank랭킹은 :", deathNoteRank, "위 입니다.");
  // console.log("킬: ", kills, "회 기록하셨습니다.");
  // console.log("데스: ", deaths, "회 기록하셨습니다.");
  // console.log("어시스트: ", assists, "회 기록하셨습니다.");
  // console.log("k/d/a: ", kills, "/", deaths, "/", assists, " 입니다.");
  // console.log(
  //   "kda 점수는 = ",
  //   kills * 3 + assists * 2 - deaths * 2,
  //   "점 입니다."
  // );
  let ret = {
    dealRank: dealRank.find((rank) => rank.participantId === participantId)
      .rank,
    tankRank: tankRank.find((rank) => rank.participantId === participantId)
      .rank,
    visionRank: visionRank.find((rank) => rank.participantId === participantId)
      .rank,
    towerDealRank: towerDealRank.find(
      (rank) => rank.participantId === participantId
    ).rank,
    kdaScoreRank: kdaScoreRank.find(
      (rank) => rank.participantId === participantId
    ).rank,
    deathNoteRank: deathNoteRank,
    win: win,
    kills: kills,
    deaths: deaths,
    assists: assists,
  };

  // if (!win) {
  //   deathNoteRank = deathNoteRank - 1;
  // }
  // return deathNoteRank;
  return ret;
};

export default Match;
