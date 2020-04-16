// /client/src/App.js

import React, { useState, useEffect } from "react";

// SERVICES
import productService from "./services/productService";
import { api } from "./api/summoner.js";
import "./styles/home.scss";

const App = () => {
  const [summoner, setSummoner] = useState();
  const [summonerData, setSummonerData] = useState();
  const [summonerRank, setSummonerRank] = useState();
  const [summonerTierSrc, setSummonerTierSrc] = useState();
  const [summonerProfileIconSrc, setSummonerProfileIconSrc] = useState();
  const [summonerTier, setSummonerTier] = useState();
  const [summonerChampionMastery, setSummonerChampionMastery] = useState();
  const [allChampionInfo, setAllChampionInfo] = useState();
  const [summonerChampionInfo, setSummonerChampionInfo] = useState();
  const champion = [];
  const handleInput = (text) => {
    setSummoner(text);
  };
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };
  const onSubmit = async () => {
    try {
      const infoTemp = await api.getSummonerByName(summoner);
      const rankTemp = await api.getLeagueByEncryptedId(infoTemp.id);
      const championMasteryTemp = await api.getChampionMasteryByEncryptedSummonerId(
        infoTemp.id
      );
      const championInfo = await api.getChampionInfo();
      const tierTemp = `/ranked-emblems/Emblem_${rankTemp[0].tier}.png`;
      const profileIconTemp = `http://ddragon.leagueoflegends.com/cdn/10.8.1/img/profileicon/${infoTemp.profileIconId}.png`;

      await championMasteryTemp.map((object) => {
        Object.keys(championInfo).forEach((key) => {
          if (championInfo[key].key === object.championId.toString()) {
            const imgSrc = `http://ddragon.leagueoflegends.com/cdn/10.8.1/img/champion/${key}.png`;
            // 챔피언의 key와 그에 따른 챔피언 이미지를 champion 객체에 추가시켜줍니다.
            champion.push({ key, imgSrc, name: championInfo[key].name });
          }
        });
      });
      // Object.keys(championInfo).forEach((key) => {
      //   console.log(championInfo[key]);
      // });
      // championInfo.filter(){

      // }
      console.log(championInfo);
      setSummonerData(infoTemp);
      setSummonerRank(rankTemp);
      setSummonerTierSrc(tierTemp);
      setSummonerProfileIconSrc(profileIconTemp);
      setSummonerTier(rankTemp[0].tier + " " + rankTemp[0].rank);
      setSummonerChampionMastery(championMasteryTemp);
      setAllChampionInfo(championInfo);
      setSummonerChampionInfo(champion);
      console.log(infoTemp);
      console.log(rankTemp);
      console.log(championMasteryTemp);
      console.log(champion);
    } catch (err) {
      console.error(err);
    }
  };

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
          <span className="home-input-search-btn" onClick={() => onSubmit()}>
            검색
          </span>
        </div>
      </div>

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

  // const [products, setproducts] = useState(null);

  // useEffect(() => {
  //   if (!products) {
  //     getProducts();
  //   }
  // });

  // const getProducts = async () => {
  //   let res = await productService.getAll();
  //   console.log(res);
  //   setproducts(res);
  // };

  // const renderProduct = (product) => {
  //   return (
  //     <li key={product._id} className="list__item product">
  //       <h3 className="product__name">{product.name}</h3>
  //       <p className="product__description">{product.description}</p>
  //     </li>
  //   );
  // };

  // return (
  //   <div className="App">
  //     <ul className="list">
  //       {products && products.length > 0 ? (
  //         products.map((product) => renderProduct(product))
  //       ) : (
  //         <p>No products found</p>
  //       )}
  //     </ul>
  //   </div>
  // );
};

export default App;
