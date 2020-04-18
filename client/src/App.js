// /client/src/App.js

import React, { useState, useEffect } from "react";

// SERVICES
import productService from "./services/productService";
import { api } from "./api/summoner.js";
import "./styles/home.scss";

// const useStateWithLocalStorage = (key) => {
//   const [value, setValue] = React.useState(localStorage.getItem(key) || "");
//   React.useEffect(() => {
//     localStorage.setItem(key, value);
//   }, [value]);
//   return [value, setValue];
// };

const App = () => {
  const [summoner, setSummoner] = useState();
  const [summonerHistory, setSummonerHistory] = useState(
    JSON.parse(localStorage.getItem("summonerName")) || null
  );
  let history;
  useEffect(() => {
    // if (summonerHistory && summonerHistory.nameHistory !== []) {
    //   history = summonerHistory;
    //   console.log(history);
    // } else {
    //   history = { nameHistory: [] };
    //   console.log(history);
    // }
    let jsonTemp = JSON.parse(localStorage.getItem("summonerName"));
    if (jsonTemp) {
      history = jsonTemp;
    } else {
      history = { nameHistory: [] };
    }
    // console.log(history);
    // console.log(onInput);
  });
  // console.log(JSON.parse(localStorage.getItem("summonerName")));
  const [summonerData, setSummonerData] = useState();
  const [summonerRank, setSummonerRank] = useState();
  const [summonerTierSrc, setSummonerTierSrc] = useState();
  const [summonerProfileIconSrc, setSummonerProfileIconSrc] = useState();
  const [summonerTier, setSummonerTier] = useState();
  const [summonerChampionMastery, setSummonerChampionMastery] = useState();
  const [allChampionInfo, setAllChampionInfo] = useState();
  const [summonerChampionInfo, setSummonerChampionInfo] = useState();
  const [onInput, setOnInput] = useState(false);
  const champion = [];

  // console.log(localStorage.getItem("summonerName"));
  const handleInput = (text) => {
    setOnInput(true);
    setSummoner(text);
  };
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };
  const onSubmit = async (name) => {
    let nameCheck = false;
    try {
      let infoTemp;
      if (name) {
        infoTemp = await api.getSummonerByName(name);
        nameCheck = true;
      } else {
        infoTemp = await api.getSummonerByName(summoner);
      }

      const rankTemp = await api.getLeagueByEncryptedId(infoTemp.id);
      const championMasteryTemp = await api.getChampionMasteryByEncryptedSummonerId(
        infoTemp.id
      );
      const championInfo = await api.getChampionInfo();
      const tierTemp = `/ranked-emblems/Emblem_${rankTemp[0].tier}.png`;
      const profileIconTemp = `https://ddragon.leagueoflegends.com/cdn/10.8.1/img/profileicon/${infoTemp.profileIconId}.png`;

      await championMasteryTemp.map((object) => {
        Object.keys(championInfo).forEach((key) => {
          if (championInfo[key].key === object.championId.toString()) {
            const imgSrc = `https://ddragon.leagueoflegends.com/cdn/10.8.1/img/champion/${key}.png`;
            // 챔피언의 key와 그에 따른 챔피언 이미지를 champion 객체에 추가시켜줍니다.
            champion.push({ key, imgSrc, name: championInfo[key].name });
          }
        });
      });
      // console.log(championInfo);
      setSummonerData(infoTemp);
      setSummonerRank(rankTemp);
      setSummonerTierSrc(tierTemp);
      setSummonerProfileIconSrc(profileIconTemp);
      setSummonerTier(rankTemp[0].tier + " " + rankTemp[0].rank);
      setSummonerChampionMastery(championMasteryTemp);
      setAllChampionInfo(championInfo);
      setSummonerChampionInfo(champion);
      // console.log(infoTemp);
      // console.log(rankTemp);
      // console.log(championMasteryTemp);
      // console.log(champion);
      // local storage 에 검색한 소환사 이름을 저장해준다.
      // let history = summonerHistory ? summonerHistory : { nameHistory: [] };
      // console.log(history);
      if (!nameCheck) {
        history.nameHistory.push(infoTemp.name);
        history.nameHistory = Array.from(new Set(history.nameHistory));
        localStorage.setItem("summonerName", JSON.stringify(history));
        setSummonerHistory(history);
      }
      setOnInput(false);
    } catch (err) {
      console.error(err);
    }
  };
  // const onRecentSubmit = async (name) => {

  //   try {
  //     const infoTemp = await api.getSummonerByName(name);
  //     const rankTemp = await api.getLeagueByEncryptedId(infoTemp.id);
  //     const championMasteryTemp = await api.getChampionMasteryByEncryptedSummonerId(
  //       infoTemp.id
  //     );
  //     const championInfo = await api.getChampionInfo();
  //     const tierTemp = `/ranked-emblems/Emblem_${rankTemp[0].tier}.png`;
  //     const profileIconTemp = `https://ddragon.leagueoflegends.com/cdn/10.8.1/img/profileicon/${infoTemp.profileIconId}.png`;

  //     await championMasteryTemp.map((object) => {
  //       Object.keys(championInfo).forEach((key) => {
  //         if (championInfo[key].key === object.championId.toString()) {
  //           const imgSrc = `https://ddragon.leagueoflegends.com/cdn/10.8.1/img/champion/${key}.png`;
  //           // 챔피언의 key와 그에 따른 챔피언 이미지를 champion 객체에 추가시켜줍니다.
  //           champion.push({ key, imgSrc, name: championInfo[key].name });
  //         }
  //       });
  //     });
  //     console.log(championInfo);
  //     setSummonerData(infoTemp);
  //     setSummonerRank(rankTemp);
  //     setSummonerTierSrc(tierTemp);
  //     setSummonerProfileIconSrc(profileIconTemp);
  //     setSummonerTier(rankTemp[0].tier + " " + rankTemp[0].rank);
  //     setSummonerChampionMastery(championMasteryTemp);
  //     setAllChampionInfo(championInfo);
  //     setSummonerChampionInfo(champion);
  //     console.log(infoTemp);
  //     console.log(rankTemp);
  //     console.log(championMasteryTemp);
  //     console.log(champion);
  //     // local storage 에 검색한 소환사 이름을 저장해준다.
  //     // let history = summonerHistory ? summonerHistory : { nameHistory: [] };
  //     console.log(history);
  //     history.nameHistory.push(summoner);
  //     history.nameHistory = Array.from(new Set(history.nameHistory));
  //     localStorage.setItem("summonerName", JSON.stringify(history));
  //     setSummonerHistory(history);
  //     setOnInput(false);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <div>
      <div className="logo-wrap">
        <img className="logo" src="./deathnote.png" alt="deathnote-logo" />
      </div>
      <div className="home-input-wrap">
        <input
          className="home-input"
          type="text"
          onChange={(e) => handleInput(e.target.value)}
          onKeyPress={onKeyPress}
        />
        <div className="home-input-search-btn-wrap">
          <span className="home-input-search-btn" onClick={() => onSubmit("")}>
            검색
          </span>
        </div>
      </div>
      {onInput ? (
        <div className="home-input-recent">
          {summonerHistory ? (
            summonerHistory.nameHistory.map((name, key) => {
              // console.log(name);
              return (
                <div
                  key={key}
                  className="home-input-recent-text-wrap"
                  onClick={() => onSubmit(name)}
                >
                  <span className="home-input-recent-text">{name}</span>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
      {summonerData ? (
        <div className="summoner-info">
          <div className="summoner-profile">
            <div className="summoner-profile-icon-wrap">
              <img
                className="summoner-profile-icon"
                src={summonerProfileIconSrc}
                alt="profile"
              />
            </div>
            <div className="summoner-info-wrap">
              <div className="summoner-name-wrap">
                <span className="summoner-name">{summonerData.name}</span>
              </div>
              <div className="summoner-level-wrap">
                <span className="summoner-level">
                  {summonerData.summonerLevel} Level
                </span>
              </div>
            </div>
            <div className="summoner-percentage">
              <div className="summoner-percentage-wrap">
                <span className="summoner-percentage-defeat-text">패배각</span>
                <span className="summoner-percentage" style={{ color: "red" }}>
                  81
                </span>
                <span className="summoner-percentage">%</span>
              </div>
              <div className="summoner-percentage-wrap">
                <span className="summoner-percentage-defeat-text">매너</span>
                <span className="summoner-percentage" style={{ color: "red" }}>
                  2
                </span>
                <span className="summoner-percentage">점</span>
              </div>
            </div>
          </div>
          <hr
            style={{ color: "#d5d5d5", border: "thin solid" }}
            className="profile-hr"
          />
          <div className="summoner-tier">
            <div className="summoner-tier-img-wrap">
              <img
                className="summoner-tier-img"
                src={summonerTierSrc}
                alt="rank"
              />
            </div>
            <div className="summoner-tier-info">
              <div className="summoner-tier-info-tier-wrap">
                <span className="summoner-tier-info-tier">{summonerTier}</span>
              </div>
              <div className="summoner-tier-info-percentage-wrap">
                <span className="summoner-tier-info-percentage">승률 52%</span>
              </div>
            </div>
          </div>
          {/* 소환사 리뷰 */}
          <div className="summoner-review">
            <span className="summoner-review-text">Review</span>
            <div className="summoner-review-input-wrap">
              <input
                className="summoner-review-input"
                type="textarea"
                rows="4"
                placeholder="소환사의 리뷰를 작성해주세요."
              />
            </div>
          </div>
          {summonerChampionInfo ? (
            summonerChampionInfo.map((obj, key) => {
              return (
                <div className="champion-info" key={key}>
                  <div className="champion-info-each">
                    <div className="champion-img-wrap">
                      <img
                        className="champion-img"
                        src={obj.imgSrc}
                        alt={obj.name}
                      />
                    </div>
                    <div className="champion-name-wrap">
                      <span className="champion-name">{obj.name}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;
