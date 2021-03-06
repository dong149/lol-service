import { useState, useEffect } from "react";
import { api } from "../../api/summoner";

const Match = async (accountId, summonerName, matchList) => {
  let matchInfo;
  let sum = 0;
  let gameCnt = 0;
  let finalScore;
  let rankInfo = [];
  let isTroll = "";
  let res = matchList;
  const championInfo = await api.getChampionInfo();

  let gameList = [];
  let rankCnt = 0;
  let errorCheck = false;
  const promises = [];

  for (let cnt = 0; cnt < 20; cnt++) {
    promises.push(api.getMatchInfo(res.matches[cnt].gameId));
  }
  await Promise.all(promises)
    .then((games) => {
      for (let cnt = 0; cnt < 20; cnt++) {
        let temp = games[cnt];
        if (
          temp.gameMode === "CLASSIC" &&
          temp.gameDuration >= 800 &&
          temp.participantIdentities[5].player.accountId !== "0"
        ) {
          temp["cnt"] = cnt;
          gameList.push(temp);
          console.log(temp);
          rankCnt++;
        }
      }
    })
    .catch((err) => {
      console.log("에러발생이요!");
      errorCheck = true;
    });

  console.log("for문 끝", new Date());

  const getMatchList = async () => {
    try {
      for (let i = 0; i < rankCnt; i++) {
        console.log(gameList[i]);
        let matchInfo = gameList[i];
        let cnt = matchInfo.cnt;
        let lane = res.matches[cnt].lane;

        gameCnt++;

        let rank = await deathNote(matchInfo, accountId);

        if (rank.win) {
          sum = sum + rank.deathNoteRank;
        } else {
          sum = sum + (rank.deathNoteRank - 1);
        }
        let championImg;
        Object.keys(championInfo).forEach((key) => {
          if (championInfo[key].key === res.matches[cnt].champion.toString()) {
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
      finalScore = (11 - (sum / rankCnt) * 1.0) * 10;
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
    } catch (err) {
      console.log(err);
    }
  };
  await getMatchList();
  let ret = {
    finalScore: finalScore,
    rankInfo: rankInfo,
    isTroll: isTroll,
    rankCnt: rankCnt,
    error: errorCheck,
  };

  console.log("ret:", ret);
  if (ret) return ret;
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
      // console.log(deathNoteScore[i].deathNoteScore);
      deathNoteRank = 10 - i;
      break;
    }
  }

  // for(let i=0;i<)
  let win = matchInfo.participants[participantId - 1].stats.win;
  let kills = matchInfo.participants[participantId - 1].stats.kills;
  let deaths = matchInfo.participants[participantId - 1].stats.deaths;
  let assists = matchInfo.participants[participantId - 1].stats.assists;
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

  return ret;
};

export default Match;
