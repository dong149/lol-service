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
  const handleInput = (text) => {
    setSummoner(text);
  };
  const onSubmit = async () => {
    try {
      const infoTemp = await api.getSummonerByName(summoner);
      const rankTemp = await api.getLeagueByEncryptedId(infoTemp.id);
      const tierTemp = `/ranked-emblems/Emblem_${rankTemp[0].tier}.png`;
      setSummonerData(infoTemp);
      setSummonerRank(rankTemp);
      setSummonerTierSrc(tierTemp);

      console.log(infoTemp);
      console.log(rankTemp);
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
        />
        <div className="home-input-search-btn-wrap">
          <span className="home-input-search-btn" onClick={() => onSubmit()}>
            검색
          </span>
        </div>
      </div>

      {summonerData ? (
        <div className="summoner-info">
          <div className="summoner-tier-wrap">
            <img className="summoner-tier" src={summonerTierSrc} alt="rank" />
          </div>
          <div className="summoner-name-wrap">
            <span className="summoner-name">{summonerData.name}</span>
            <span className="summoner-name">
              레벨{summonerData.summonerLevel}
            </span>
          </div>
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
