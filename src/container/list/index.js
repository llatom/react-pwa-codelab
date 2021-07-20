import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clientFetch from '../../util/fetch'
import { connect } from "react-redux";
import "./index.less";

function ListPageContainer(props) {
  const [countryData, setcountryData] = useState({})

  useEffect(() => {
    fetchCountryData()
  }, [])

  const fetchCountryData = () => {
    clientFetch({
      url : 'https://api.jisuapi.com/country/query?name=&continent=&language=&iscountry=&appkey=7dbab58bc294e565'
    }).then(res=>{
      if(res.status === 0 ){
        setcountryData(res.result[0])
      }else{
        alert('获取接口失败')
      }
    })
  }

  return (
    <div className="page-list">
      <header className="header">
        service worker
      </header>
      <div>使用了最新版本的webpack，编译速度更快</div>
    </div>
  );
}

export default connect(
  (state) => ({}),
  (dispatch) => ({
    actions: {},
  })
)(ListPageContainer);

