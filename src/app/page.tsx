"use client";
import React, { useState, useEffect } from 'react';
import words from './words';
import './globals.css';
import Head from 'next/head';

const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [wordList, setWordList] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  // const wordsPerMinute = Math.round((correctCount + incorrectCount) / ((60 - timeLeft) / 60));
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  useEffect(() => {
    const calculateWordsPerMinute = () => {
      return Math.round((correctCount + incorrectCount) / ((60 - timeLeft) / 60));
    };
  
    setWordsPerMinute(calculateWordsPerMinute());
  }, [correctCount, incorrectCount, timeLeft]);
 
  const [changeStartIndex,setChangeStartIndex] = useState(10);
 const [changeEndIndex,setChangeEndIndex] = useState(20);

   
  useEffect(() => {
    generateWordList();
  }, []);

  useEffect(() => {
    if (inputValue.length === 1) {
      setStartTime(Date.now());
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            endTest();
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [inputValue]);

  useEffect(() => {
    if (endTime !== 0) {
      const calculateWordsPerMinute = () => {
        return Math.round((correctCount + incorrectCount) / ((60 - timeLeft) / 60));
      };
  
      setWordsPerMinute(calculateWordsPerMinute());
    }
  }, [endTime, correctCount, incorrectCount, timeLeft]);

  const generateWordList = () => {
    
    const wordsPerPage = 10;
    const startIndex = Math.floor(currentWordIndex / wordsPerPage) * wordsPerPage;
    const endIndex = startIndex + wordsPerPage;
    const wordSubset = words.slice(startIndex, endIndex);
    setWordList(wordSubset);
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (startTime === 0) {
      setStartTime(Date.now());
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            endTest();
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
      checkWord();
    }
    setTotalKeystrokes((prevKeystrokes) => prevKeystrokes + 1);
  };

  const checkWord = () => {
    const currentWord = wordList[currentWordIndex];
    if (inputValue.trim().toLowerCase() === currentWord.toLowerCase()) {
      setCorrectCount((prevCorrectCount) => prevCorrectCount + 1);
    } else {
      setIncorrectCount((prevIncorrectCount) => prevIncorrectCount + 1);
    }
    setInputValue('');

    if (currentWordIndex === wordList.length - 1) {

      const wordSubset = words.slice(changeStartIndex, changeEndIndex);
      setWordList(wordSubset);
      setChangeStartIndex((prevStartIndex) => prevStartIndex + 10);
      setChangeEndIndex((prevStartIndex) => prevStartIndex + 10);
      setCurrentWordIndex(0);
      
    } else {
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
    }
  };

  const endTest = () => {
    setEndTime(Date.now());
  };

  const restartTest = () => {
    setCorrectCount(0);
    setIncorrectCount(0);
    setTotalKeystrokes(0);
    setStartTime(0);
    setEndTime(0);
    setTimeLeft(60);
    generateWordList();
    setCurrentWordIndex(0); // İlk kelimeye geçiş yapılıyor
    setInputValue(''); // Input değerini sıfırlıyoruz
  };
  

  return (
    <div  >
          <div>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com"  />
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
      </Head>
      {/* Sayfa içeriği */}
    </div>
      {endTime === 0 ? (
        <div className='body'>
      <h1>Klavye Yazma Testi</h1>
          <p className='kalanSure'>Kalan Süre: <span style={{fontWeight:'bold'}}>{timeLeft}</span> saniye</p>
          <div className='wordsContainer'>
          {wordList.map((word, index) => (
            <span key={index}>
              {index === currentWordIndex && <strong>{word}</strong>}
              {index !== currentWordIndex && word}
              &nbsp;
            </span>
          ))}
          </div>
          <input placeholder='yazmaya başlayın...' className='speedInput' type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyPress} />
    
          <div className='myTable'>
  <table style={{ width: '270px', borderCollapse: 'collapse',overflow:'hidden' }}>
  <tbody>
    <tr>
      <td style={{ backgroundColor: 'white', padding: '12px',   textAlign: 'center' }}>Doğru Kelime Sayısı:</td>
      <td style={{ backgroundColor: 'white', fontWeight:'bold',color:'green', padding: '12px', textAlign: 'center' }}>{correctCount}</td>
    </tr>
    <tr>
      <td style={{ backgroundColor: '#f2f2f2', padding: '12px',  textAlign: 'center' }}>Yanlış Kelime Sayısı:</td>
      <td style={{ backgroundColor: '#f2f2f2', padding: '12px', fontWeight:'bold',color:'red', textAlign: 'center' }}>{incorrectCount}</td>
    </tr>
    <tr>
      <td style={{ backgroundColor: 'white', padding: '12px',   textAlign: 'center' }}>Toplam Tuş Vuruşu:</td>
      <td style={{ backgroundColor: 'white', padding: '12px',fontWeight:'bold',color:'black',  textAlign: 'center' }}>{totalKeystrokes}</td>
    </tr>
    <tr>
      <td style={{ backgroundColor: '#f2f2f2', padding: '12px',   textAlign: 'center' }}>Hız:</td>
      <td style={{ backgroundColor: '#f2f2f2', padding: '12px', fontWeight:'bold',color:'black', textAlign: 'center' }}>{isNaN(wordsPerMinute) ? 0 : wordsPerMinute} kelime/dakika</td>
    </tr>
  </tbody>
</table></div>




        </div>
      ) : (
        <div className='finishBody'>
          <h1>Test Tamamlandı!</h1>

          <div className='resultTable'>
          <p style={{color:'purple',fontWeight:'bold'}}>Süre: 60 saniye</p>
          <p style={{color:'green',fontWeight:'bold'}}>Doğru Kelime Sayısı: {correctCount}</p>
          <p style={{color:'red',fontWeight:'bold'}}>Yanlış Kelime Sayısı: {incorrectCount}</p>
          <p style={{color:'black',fontWeight:'bold'}}>Toplam Tuş Vuruşu: {totalKeystrokes}</p>
          <p style={{color:'gray',fontWeight:'bold'}}>Hız: {wordsPerMinute} kelime/dakika</p>
          </div>
          <button className='restartButton' onClick={restartTest}>Tekrar Dene</button>
        </div>
      )}
          <footer className="footer">Burak Çetin</footer>

    </div>
  );
};
export default Home;         
