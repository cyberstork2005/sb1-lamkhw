import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import gaugePanelImage1 from '../assets/gauge-panel-sample-1.jpg';
import gaugePanelImage2 from '../assets/gauge-panel-sample-2.jpg';
import productExplanationImage from '../assets/product-explanation.jpg';

function About() {
  return (
    <div className="about">
      <h2>サービスについて</h2>
      <p>カスタムメーターデザインは、車のゲージパネルを自由にカスタマイズできる新しいサービスです。</p>

      <h3>特徴</h3>
      <ul>
        <li>ユニークなゲージパネルデザイン</li>
        <li>クリエイターによる多様なデザインが集結</li>
        <li>購入者が10人集まると、デザインが製品化</li>
        <li>クリエイターには販売数に応じたロイヤリティとして支払われます</li>
      </ul>

      <h3>製品詳細</h3>
      <div className="product-details">
        <div className="product-images">
          <img src={gaugePanelImage1} alt="ゲージパネルサンプル1" />
          <img src={gaugePanelImage2} alt="ゲージパネルサンプル2" />
        </div>
        <ul>
          <li><strong>製品はゲージパネルのみです。メータークラスター、針などは含まれません。</strong></li>
          <li>最大生産枚数: 30枚</li>
          <li>製品化条件: 10枚の予約達成</li>
          <li>予約期間: 最初の予約から10日間</li>
          <li>配送: 締め切り後約1ヶ月でお届け</li>
          <li>送料: 770円</li>
        </ul>
      </div>

      <h3>製品説明</h3>
      <div className="product-explanation">
        <img src={productExplanationImage} alt="製品説明" />
        <p>
          本製品はゲージパネル（赤色で示された部分）のみです。メータークラスター本体や針、その他の部品は含まれません。
          お客様の車両に既存のメーターパネルと交換してお使いいただくものです。
        </p>
      </div>

      <h3>クリエイターの方へ</h3>
      <p>あなたのユニークなゲージパネルデザインを提供し、収益を得るチャンスです。多くのユーザーが、あなたのデザインを楽しみにしています！</p>
      <Link to="/design-upload" className="cta-button">デザイン登録はこちら</Link>

      <h3>購入者の方へ</h3>
      <p>お気に入りのデザインを見つけて、あなたの車をさらに個性的にしましょう。10人が予約すれば、そのデザインが現実のものになります！</p>
      <p><strong>購入だけの場合はログインは不要です。</strong>気に入ったデザインをすぐに予約できます。</p>
      <p>定番製品以外は、期間限定の生産です。最初の予約が入ってから10日間限定で、最大30枚まで生産されます。予約が10枚に達しない場合、予約は自動的にキャンセルされ、デザインは再度アップロードされます。</p>

      <p>定番製品以外は限定生産で、再販の予定はございません。お気に入りのデザインを見つけたら、お早めにご予約ください。</p>
    </div>
  );
}

export default About;