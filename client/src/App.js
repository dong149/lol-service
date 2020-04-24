// /client/src/App.js

import React, { useState, useEffect } from "react";

// SERVICES
import productService from "./services/productService";
import reviewService from "./services/reviewService";
import { api } from "./api/summoner.js";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { SemipolarLoading } from "react-loadingg";
import "./styles/home.scss";
import Match from "./components/match";

const App = () => {
  const [summoner, setSummoner] = useState();
  const [summonerHistory, setSummonerHistory] = useState(
    JSON.parse(localStorage.getItem("summonerName")) || null
  );
  let history;
  useEffect(() => {
    let jsonTemp = JSON.parse(localStorage.getItem("summonerName"));
    if (jsonTemp) {
      history = jsonTemp;
    } else {
      history = { nameHistory: [] };
    }
  });
  // loading
  const [loading, setLoading] = useState(false);

  // summoner
  const [summonerData, setSummonerData] = useState();
  const [summonerMatchInfo, setSummonerMatchInfo] = useState();
  const [summonerRank, setSummonerRank] = useState();
  const [summonerTierSrc, setSummonerTierSrc] = useState();
  const [summonerProfileIconSrc, setSummonerProfileIconSrc] = useState();
  const [summonerTier, setSummonerTier] = useState();
  const [summonerChampionMastery, setSummonerChampionMastery] = useState();
  const [allChampionInfo, setAllChampionInfo] = useState();
  const [summonerChampionInfo, setSummonerChampionInfo] = useState();
  const [championOpen, setChampionOpen] = useState(false);
  const [onInput, setOnInput] = useState(false);

  // review
  const [reviewViewOpen, setReviewViewOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [review, setReview] = useState();
  const [reviewExist, setReviewExist] = useState(false);
  const [reviewChange, setReviewChange] = useState(false);

  const [summonerInfo, setSummonerInfo] = useState();

  const champion = [];

  const handleInput = (text) => {
    setOnInput(true);
    setSummoner(text);
  };
  const handleReviewInput = (text) => {
    setReviewText(text);
  };
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };
  const onSubmit = async (name) => {
    setLoading(true);
    setSummonerMatchInfo();
    let nameCheck = false;
    let infoTemp;
    try {
      if (name) {
        infoTemp = await api.getSummonerByName(name).catch((err) => {
          alert("소환사 정보가 없습니다.");

          setLoading(false);
          window.location.reload();
          return;
        });
        // console.log(name);
        setSummonerInfo(infoTemp);
        nameCheck = true;
      } else {
        infoTemp = await api.getSummonerByName(summoner).catch((err) => {
          alert("소환사 정보가 없습니다.");
          setLoading(false);
          window.location.reload();
          return;
        });
        setSummonerInfo(infoTemp);
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
      setSummonerData(infoTemp);
      setSummonerRank(rankTemp);
      setSummonerTierSrc(tierTemp);
      setSummonerProfileIconSrc(profileIconTemp);
      setSummonerTier(rankTemp[0].tier + " " + rankTemp[0].rank);
      setSummonerChampionMastery(championMasteryTemp);
      setAllChampionInfo(championInfo);
      setSummonerChampionInfo(champion);
      setReviewText("");
      setReview();
      if (!nameCheck) {
        history.nameHistory.push(infoTemp.name);
        history.nameHistory = Array.from(new Set(history.nameHistory));
        localStorage.setItem("summonerName", JSON.stringify(history));
        setSummonerHistory(history);
      }

      let matchInfo = await Match(infoTemp.accountId, infoTemp.name);
      console.log("매치정보: ", matchInfo);
      setSummonerMatchInfo(matchInfo);

      setLoading(false);
      setOnInput(false);
    } catch (err) {
      console.error(err);
    }
  };
  const onBadMode = () => {
    setReviewMode(false);
  };
  const onGoodMode = () => {
    setReviewMode(true);
  };

  const onReviewSubmit = async (type) => {
    // console.log(summonerInfo.name);
    try {
      const date = format(new Date(), "yyyyMMddHHmmss");
      const review = {
        name: summonerInfo.name || "",
        date: date,
        type: type,
        content: reviewText || "",
      };
      // console.log(review);
      // console.log(reviewText);
      reviewService.postReview(review);
      setReviewChange(true);
      setReviewText("");
      alert("성공적으로 제출되었습니다.");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if ((summonerInfo && !review) || reviewChange === true) {
      getReview(summonerInfo.name);
    }
  });

  const getReview = async (name) => {
    // console.log(name);
    let res = await reviewService.getSummonerReview(name);
    if (!res) {
      setReviewExist(false);
    } else {
      setReviewExist(true);
    }
    // if (reviewChange === true) console.log("changed");
    setReview(res);
    setReviewChange(false);
  };
  // 언제 게시되었는지를 알려주는 함수입니다.
  const handleDate = (date) => {
    let dyear = parseInt(date.substring(0, 4));
    let dmonth = parseInt(date.substring(4, 6)) - 1;
    let dday = parseInt(date.substring(6, 8));
    let dhour = parseInt(date.substring(8, 10));
    let dmin = parseInt(date.substring(10, 12));
    let dsec = parseInt(date.substring(12, 14));

    let res = formatDistanceToNow(
      new Date(dyear, dmonth, dday, dhour, dmin, dsec),
      { includeSeconds: true, locale: ko }
    );

    let reslen = res.length;
    if (res[reslen - 1] === "만") {
      if (res[1] === "초") {
        res = res.substring(0, 2);
      } else {
        res = res.substring(0, 3);
      }
    }
    let result = res + " 전";
    return result;
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
          <span className="home-input-search-btn" onClick={() => onSubmit("")}>
            검색
          </span>
        </div>
      </div>
      {onInput ? (
        <div className="home-input-recent">
          {summonerHistory ? (
            summonerHistory.nameHistory.map((name, key) => {
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
              {summonerMatchInfo ? (
                <div className="summoner-percentage-wrap">
                  <span className="summoner-percentage-info-text">
                    최근20경기
                  </span>
                  <span
                    className="summoner-percentage"
                    style={{ color: "red" }}
                  >
                    {summonerMatchInfo.finalScore}
                  </span>
                  <span className="summoner-percentage">점</span>
                </div>
              ) : (
                <div className="summoner-percentage-loading-wrap">
                  <span className="summoner-percentage-loading">
                    점수 계산중
                  </span>
                </div>
              )}
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
          {/* 최근 경기 분석 */}
          {summonerMatchInfo ? (
            <div className="summoner-match-info">
              <span className="summoner-match-info-text">최근 경기</span>
              {summonerMatchInfo.rankInfo.map((obj, key) => {
                return obj.win ? (
                  <div className="summoner-match-win-wrap" key={key}>
                    <div className="summoner-match-champion-img-wrap">
                      <img
                        className="summoner-match-champion-img"
                        src={obj.championImg}
                        alt={obj.champion}
                      />
                    </div>
                    <div className="summoner-match-rank-wrap-wrap">
                      <div className="summoner-match-rank-wrap">
                        <span className="summoner-match-rank">
                          딜량: {obj.dealRank}등
                        </span>
                      </div>
                      <div className="summoner-match-rank-wrap">
                        <span className="summoner-match-rank">
                          탱킹: {obj.tankRank}등
                        </span>
                      </div>
                    </div>
                    <div className="summoner-match-rank-wrap-wrap">
                      <div className="summoner-match-rank-wrap">
                        <span className="summoner-match-rank">
                          타워딜: {obj.towerDealRank}등
                        </span>
                      </div>

                      <div className="summoner-match-rank-wrap">
                        <span className="summoner-match-rank">
                          kda점수: {obj.kdaScoreRank}등
                        </span>
                      </div>
                    </div>
                    <div className="summoner-match-kda-wrap">
                      <span className="summoner-match-kda">
                        {obj.kills}/{obj.deaths}/{obj.assists}
                      </span>
                    </div>
                    <div className="summoner-deathnote-rank-wrap">
                      <span className="summoner-deathnote-rank">
                        {obj.deathNoteRank}
                      </span>
                      <span>등</span>
                    </div>
                  </div>
                ) : (
                  <div className="summoner-match-defeat-wrap" key={key}>
                    <div className="summoner-match-champion-img-wrap">
                      <img
                        className="summoner-match-champion-img"
                        src={obj.championImg}
                        alt={obj.champion}
                      />
                    </div>
                    <div className="summoner-match-rank-wrap-wrap">
                      <div className="summoner-match-rank-wrap">
                        <span className="summoner-match-rank">
                          딜량: {obj.dealRank}등
                        </span>
                      </div>
                      <div className="summoner-match-rank-wrap">
                        <span className="summoner-match-rank">
                          탱킹: {obj.tankRank}등
                        </span>
                      </div>
                    </div>
                    <div className="summoner-match-rank-wrap-wrap">
                      <div className="summoner-match-rank-wrap">
                        <span className="summoner-match-rank">
                          타워딜: {obj.towerDealRank}등
                        </span>
                      </div>

                      <div className="summoner-match-rank-wrap">
                        <span className="summoner-match-rank">
                          kda점수: {obj.kdaScoreRank}등
                        </span>
                      </div>
                    </div>
                    <div className="summoner-match-kda-wrap">
                      <span className="summoner-match-kda">
                        {obj.kills}/{obj.deaths}/{obj.assists}
                      </span>
                    </div>
                    <div className="summoner-deathnote-rank-wrap">
                      <span className="summoner-deathnote-rank">
                        {obj.deathNoteRank}
                      </span>
                      <span>등</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <></>
          )}
          {/* 소환사 리뷰 */}
          <div className="summoner-review">
            <span className="summoner-review-text">REVIEW</span>
            <div className="summoner-review-type">
              <span className="summoner-review-type-text">MODE : </span>
              <div
                className="summoner-review-type-bad-wrap"
                onClick={() => onBadMode()}
              >
                <span className="summoner-review-type-bad">리폿</span>
              </div>
              <div
                className="summoner-review-type-good-wrap"
                onClick={() => onGoodMode()}
              >
                <span className="summoner-review-type-good">칭찬</span>
              </div>
            </div>
            {reviewMode ? (
              <>
                <div className="summoner-review-good-input-wrap">
                  <textarea
                    className="summoner-review-good-input"
                    onChange={(e) => handleReviewInput(e.target.value)}
                    rows="4"
                    placeholder="소환사의 리뷰를 작성해주세요."
                  />
                </div>
                <div className="summoner-review-btn-wrap">
                  <span
                    className="summoner-review-submit-btn"
                    onClick={() => onReviewSubmit("good")}
                  >
                    작성하기
                  </span>
                  <span className="summoner-review-close-btn">닫기</span>
                </div>
              </>
            ) : (
              <>
                <div className="summoner-review-bad-input-wrap">
                  <textarea
                    className="summoner-review-bad-input"
                    onChange={(e) => handleReviewInput(e.target.value)}
                    rows="4"
                    value={reviewText}
                    placeholder="소환사의 리뷰를 작성해주세요."
                  />
                </div>
                <div className="summoner-review-btn-wrap">
                  <span
                    className="summoner-review-submit-btn"
                    onClick={() => onReviewSubmit("bad")}
                  >
                    작성하기
                  </span>
                  <span className="summoner-review-close-btn">닫기</span>
                </div>
              </>
            )}
            {/* 소환사 리뷰 view */}
            <div
              className="review-view"
              style={{
                overflow: reviewViewOpen ? "visible" : "hidden",
                height: reviewViewOpen ? "auto" : "300px",
                // backgroundColor: reviewViewOpen ? "white" : "rgba(0,0,0,0.8)",
              }}
            >
              {review &&
                review
                  .slice(0)
                  .reverse()
                  .map((data, key) => {
                    if (data.name === summonerInfo.name) {
                      if (data.type === "bad") {
                        return (
                          <div key={key} className="review-view-bad">
                            <div className="review-view-date-bad-wrap">
                              <span className="review-view-date-bad">
                                {handleDate(data.date)}
                              </span>
                            </div>
                            <div className="review-view-content-bad-wrap">
                              <span className="review-view-content-bad">
                                {data.content}
                              </span>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div key={key} className="review-view-good">
                            <div className="review-view-date-good-wrap">
                              <span className="review-view-date-good">
                                {handleDate(data.date)}
                              </span>
                            </div>
                            <div className="review-view-content-good-wrap">
                              <span className="review-view-content-good">
                                {data.content}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    }
                  })}
            </div>
            {reviewExist ? (
              <div
                className="review-view-open-btn-wrap"
                onClick={() => {
                  setReviewViewOpen(!reviewViewOpen);
                }}
                style={
                  {
                    // boxShadow: reviewViewOpen ? "" : "",
                  }
                }
              >
                <span className="review-view-open-btn">
                  {reviewViewOpen ? "닫기" : "펼치기"}
                </span>
              </div>
            ) : (
              <div className="review-none-wrap">
                <span>비어있습니다. 작성해주세요!</span>
              </div>
            )}
          </div>
          <span className="champion-info-text">CHAMPION</span>
          <div
            className="champion-info-wrap"
            style={{
              overflow: championOpen ? "visible" : "hidden",
              height: championOpen ? "auto" : "500px",
              // backgroundColor: reviewViewOpen ? "white" : "rgba(0,0,0,0.8)",
            }}
          >
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
          <div
            className="champion-open-btn-wrap"
            onClick={() => {
              setChampionOpen(!championOpen);
            }}
            style={
              {
                // boxShadow: reviewViewOpen ? "" : "",
              }
            }
          >
            <span className="champion-open-btn">
              {championOpen ? "닫기" : "펼치기"}
            </span>
          </div>
        </div>
      ) : loading ? (
        <SemipolarLoading
          size="large"
          color="#ffffff"
          style={{
            position: "relative",
            top: "100px",
            margin: "0 auto",
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;
