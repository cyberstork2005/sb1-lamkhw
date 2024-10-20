import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

function CountdownTimer({ startDate, endDate, buyers, onCountdownEnd }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const TOTAL_ITEMS = 30;
  const PRODUCTION_THRESHOLD = 10;

  useEffect(() => {
    let timer;
    const calculateTimeLeft = () => {
      const now = new Date();
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (!start || !end) {
        return { status: 'not-started' };
      }

      if (now < start) {
        return { status: 'before' };
      } else if (now > end || buyers >= TOTAL_ITEMS) {
        onCountdownEnd();
        return { status: 'after' };
      } else {
        const difference = end - now;
        return {
          status: 'during',
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
    };

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.status === 'during') {
        timer = setTimeout(updateTimer, 1000);
      }
    };

    updateTimer();

    return () => clearTimeout(timer);
  }, [startDate, endDate, buyers, onCountdownEnd]);

  const renderReservationStatus = () => {
    const remainingItems = TOTAL_ITEMS - buyers;
    if (buyers >= TOTAL_ITEMS) {
      return <p className="sold-out">販売終了</p>;
    } else if (buyers >= PRODUCTION_THRESHOLD) {
      return (
        <>
          <p className="production-decided">製品化決定！</p>
          <p>残り{remainingItems}個 / 全{TOTAL_ITEMS}個</p>
        </>
      );
    } else {
      return (
        <>
          <p className="accepting-reservations">受付中</p>
          <p>製品化まであと{PRODUCTION_THRESHOLD - buyers}個</p>
          <p>残り{remainingItems}個 / 全{TOTAL_ITEMS}個</p>
        </>
      );
    }
  };

  const formatTime = (time) => {
    return time.toString().padStart(2, '0');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!timeLeft) return null;

  return (
    <div className="countdown-timer">
      <div className="reservation-status">
        {renderReservationStatus()}
      </div>
      {timeLeft.status === 'during' && (
        <>
          <p className="end-date">終了：{formatDate(endDate)}</p>
          <div className="time-left">
            残り時間：
            {timeLeft.days > 0 && <span>{timeLeft.days}日</span>}
            <span>{formatTime(timeLeft.hours)}時間</span>
            <span>{formatTime(timeLeft.minutes)}分</span>
            <span>{formatTime(timeLeft.seconds)}秒</span>
          </div>
        </>
      )}
      {timeLeft.status === 'before' && <p>まもなく予約開始</p>}
      {timeLeft.status === 'after' && buyers < TOTAL_ITEMS && <p>予約受付終了</p>}
    </div>
  );
}

export default CountdownTimer;