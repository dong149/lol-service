import { useState, useEffect } from "react";
import { api } from "../../api/summoner";

const Match = (accountId, summonerName) => {
  let matchList;
  let matchInfo;
  let sum = 0;
  let gameCnt = 0;
  const getMatchList = async () => {
    try {
      matchList = await api.getMatchList(accountId).then(async (res) => {
        for (let cnt = 0; cnt < 20; cnt++) {
          matchInfo = await api.getMatchInfo(res.matches[cnt].gameId);
          if (matchInfo.gameMode === "CLASSIC") {
            console.log(matchInfo);
            deathNote(matchInfo, accountId);
            //  gameCnt++;
            //  let temp =  deathNote(matchInfo,accountId);
            //  sum = sum + temp;
          }

          // // result = sum / gameCnt;
          // // return result;

          // console.log(cnt);
        }
        // res.matches.forEach(async (data) => {
        //   cnt++;
        //   if (cnt >= 20) return;
        //   matchInfo = await api.getMatchInfo(data.gameId);
        //   console.log(matchInfo);
        //   console.log(cnt);
        // });
      });
      // return matchList;
    } catch (err) {
      console.log(err);
    }
  };
  getMatchList();
  return;
};

const deathNote = (matchInfo, accountId) => {
  let participantId = 0;
  for (let i = 0; i < 10; i++) {
    if (matchInfo.participantIdentities[i].player.accountId === accountId) {
      participantId = matchInfo.participantIdentities[i].participantId;
      break;
    }
  }
  let kills = matchInfo.participants[participantId - 1].stats.kills;
  let deaths = matchInfo.participants[participantId - 1].stats.deaths;
  let assists = matchInfo.participants[participantId - 1].stats.assists;
  console.log("당신의 순서는: ", participantId, "번 째 입니다.");
  console.log("킬: ", kills, "회 기록하셨습니다.");
  console.log("데스: ", deaths, "회 기록하셨습니다.");
  console.log("어시스트: ", assists, "회 기록하셨습니다.");
  console.log("k/d/a: ", kills, "/", deaths, "/", assists, " 입니다.");
};

export default Match;
