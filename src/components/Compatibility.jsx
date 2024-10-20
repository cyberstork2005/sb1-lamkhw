import React from 'react';
import './Compatibility.css';

function Compatibility() {
  return (
    <div className="compatibility">
      <h2>適合車種一覧</h2>
      <div className="compatibility-list">
        <div className="compatibility-item">
          <h3>ジムニーJB74</h3>
          <p>適合年式: 2018年7月〜現行</p>
        </div>
        <div className="compatibility-item">
          <h3>GRヤリスGXPA16前期型</h3>
          <p>適合年式: 2020年9月〜2023年8月</p>
        </div>
        <div className="compatibility-item">
          <h3>GRヤリスMXPA12前期型</h3>
          <p>適合年式: 2020年9月〜2023年8月</p>
        </div>
        <div className="compatibility-item">
          <h3>スイフトZC33</h3>
          <p>適合年式: 2017年1月〜現行</p>
        </div>
      </div>
    </div>
  );
}

export default Compatibility;