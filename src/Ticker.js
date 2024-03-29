import React, { Component } from 'react';
import './Ticker.css'
import $ from 'jquery'
import { Btc, Eth, Xrp, Bch, Ada, Str, Ltc, Neo, Eos, Xem, Iota, Dash, Xmr, Lsk, Etc, Dcr, Doge, Ppc } from 'react-cryptocoins';
import CCC from './ccc-streamer-utilities';
import Subscriptions from './Subscriptions'

import io from 'socket.io-client';
const socket = io.connect('https://streamer.cryptocompare.com/');
const cryptoScaffold = {
        BTC:  { PRICE: '0.00' },
        ETH:  { PRICE: '0.00' },
        XRP:  { PRICE: '0.00' },
        BCH:  { PRICE: '0.00' },
        ADA:  { PRICE: '0.00' },
        XLM:  { PRICE: '0.00' },
        LTC:  { PRICE: '0.00' },
        NEO:  { PRICE: '0.00' },
        EOS:  { PRICE: '0.00' },
        XEM:  { PRICE: '0.00' },
        IOT:  { PRICE: '0.00' },
        DASH: { PRICE: '0.00' },
        XMR:  { PRICE: '0.00' },
        LSK:  { PRICE: '0.00' },
        ETC:  { PRICE: '0.00' },
        DCR:  { PRICE: '0.00' },
        DOGE: { PRICE: '0.00' },
        PPC:  { PRICE: '0.00' }
      }

class Ticker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollSpeed: 5,
      currentPrice: {},
      cryptos: cryptoScaffold
    }
  }

  componentWillMount = () => {
   socket.emit('SubAdd', { subs: Subscriptions });
    const that = this;
    socket.on('m', (message) => {
      const messageType = message.substring(0, message.indexOf('~'));
      let res = {};
      if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
        res = CCC.CURRENT.unpack(message);
        // make sure there's a PRICE in the response
        if(res.PRICE) {
          that.dataUnpack(res);
        }
      }
    });
  }

  componentDidMount = () => {
    this.scrollTicker()
  }

  dataUnpack = (data) => {
    const currentPrice = this.state.currentPrice;
    const from = data.FROMSYMBOL;
    const to = data.TOSYMBOL;
    const pair = from + to;
    // Do NOT use dot notionation for currentPrice[pair]
    if (!currentPrice.hasOwnProperty(pair)) {
      currentPrice[pair] = {};
    }

    for (const key in data) {
      currentPrice[pair][key] = data[key];
    }

    let currentCryptoObject = currentPrice[pair]

    currentCryptoObject.CHANGE24HOURPCT = (
      (currentCryptoObject.PRICE - currentCryptoObject.OPEN24HOUR) /
      currentCryptoObject.OPEN24HOUR * 100).toFixed(2) + '%';

    let cryptos = this.state.cryptos
    currentCryptoObject.PRICE = Number(currentCryptoObject.PRICE).toLocaleString('en');

    // 1 = Price Up, 2 = Price Down, 4 = Price Unchanged
    if (currentCryptoObject.FLAGS === '1') {
      currentCryptoObject.PRICEDIRECTION = 'up';
    } else if (currentCryptoObject.FLAGS === '2') {
      currentCryptoObject.PRICEDIRECTION = 'down';
    } else if (currentCryptoObject.FLAGS === '4') {
      currentCryptoObject.PRICEDIRECTION = 'unchanged';
    }

    // Check to see if price has a negative symbol '-'
    if (/[-]/.test(currentCryptoObject.CHANGE24HOURPCT)) {
      currentCryptoObject.PCTCHANGE = 'down';
    } else {
      currentCryptoObject.PCTCHANGE = 'up';
    }

    cryptos[from] = currentCryptoObject
    this.setState({ cryptos: cryptos })
  }

  scrollTicker = () => {
    const speed = this.state.scrollSpeed;
    let items;
    const ticker = $('.ticker');
    let width = 0;

    ticker.children().each(function(){
      width += $(this).outerWidth(true);
    });

    ticker.css('width', width);

    const scroll = () => {
      items = ticker.children();
      const scrollWidth = items.eq(0).outerWidth();
      ticker.animate(
        {'left' : 0 - scrollWidth},
        scrollWidth * 100 / speed,
        'linear', changeFirst
      );
    }

    const changeFirst = () => {
      ticker.append(items.eq(0).remove()).css('left', 0);
      scroll();
    }

    scroll();
  }

  handleMouseEnter = () => {
    $('.ticker').stop()
  }

  handleMouseLeave = () => {
    this.scrollTicker()
  }

  render() {
    const cryptos = this.state.cryptos

    return (
      <div className="tickerWrapper" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} >
        <ul className="ticker">
          <li>
            <Btc color={'Orange'} /> Bitcoin <br/>
            <span className={ cryptos.BTC.PRICEDIRECTION }>${ cryptos.BTC.PRICE }</span>
            <span className={ cryptos.BTC.PCTCHANGE }> { cryptos.BTC.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Eth color={'DarkGrey'} /> Ethereum <br/>
            <span className={ cryptos.ETH.PRICEDIRECTION }>${ cryptos.ETH.PRICE }</span>
            <span className={ cryptos.ETH.PCTCHANGE }> { cryptos.ETH.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Xrp color={'Aqua'} /> Ripple <br/>
            <span className={ cryptos.XRP.PRICEDIRECTION }>${ cryptos.XRP.PRICE }</span>
            <span className={ cryptos.XRP.PCTCHANGE }> { cryptos.XRP.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Bch color={'Peru'} /> Bitcoin Cash <br/>
            <span className={ cryptos.BCH.PRICEDIRECTION }>${ cryptos.BCH.PRICE }</span>
            <span className={ cryptos.BCH.PCTCHANGE }> { cryptos.BCH.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Ada color={'white'} /> Cardano <br/>
            <span className={ cryptos.ADA.PRICEDIRECTION }>${ cryptos.ADA.PRICE }</span>
            <span className={ cryptos.ADA.PCTCHANGE }> { cryptos.ADA.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Ltc color={'Grey'} /> LiteCoin <br/>
            <span className={ cryptos.LTC.PRICEDIRECTION }>${ cryptos.LTC.PRICE }</span>
            <span className={ cryptos.LTC.PCTCHANGE }> { cryptos.LTC.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Str color={'Aquamarine'}/> Steller <br/>
            <span className={ cryptos.XLM.PRICEDIRECTION }>${ cryptos.XLM.PRICE }</span>
            <span className={ cryptos.XLM.PCTCHANGE }> { cryptos.XLM.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Neo color={'Lime'}/> NEO <br/>
            <span className={ cryptos.NEO.PRICEDIRECTION }>${ cryptos.NEO.PRICE }</span>
            <span className={ cryptos.NEO.PCTCHANGE }> { cryptos.NEO.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Eos /> EOS <br/>
            <span className={ cryptos.EOS.PRICEDIRECTION }>${ cryptos.EOS.PRICE }</span>
            <span className={ cryptos.EOS.PCTCHANGE }> { cryptos.EOS.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Xem color={'Coral'}/> NEM <br/>
            <span className={ cryptos.XEM.PRICEDIRECTION }>${ cryptos.XEM.PRICE }</span>
            <span className={ cryptos.XEM.PCTCHANGE }> { cryptos.XEM.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Iota color={'white'}/> IOTA <br/>
            <span className={ cryptos.IOT.PRICEDIRECTION }>${ cryptos.IOT.PRICE }</span>
            <span className={ cryptos.IOT.PCTCHANGE }> { cryptos.IOT.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Dash color={'DarkTurquoise'}/> DASH <br/>
            <span className={ cryptos.DASH.PRICEDIRECTION }>${ cryptos.DASH.PRICE }</span>
            <span className={ cryptos.DASH.PCTCHANGE }> { cryptos.DASH.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Xmr color={'DarkOrange'}/> Monero <br/>
            <span className={ cryptos.XMR.PRICEDIRECTION }>${ cryptos.XMR.PRICE }</span>
            <span className={ cryptos.XMR.PCTCHANGE }> { cryptos.XMR.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Etc color={'Olive'} /> Ethereum Classic <br/>
            <span className={ cryptos.ETC.PRICEDIRECTION }>${ cryptos.ETC.PRICE }</span>
            <span className={ cryptos.ETC.PCTCHANGE }> { cryptos.ETC.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Lsk color={'Blue'}/> Lisk <br/>
            <span className={ cryptos.LSK.PRICEDIRECTION }>${ cryptos.LSK.PRICE }</span>
            <span className={ cryptos.LSK.PCTCHANGE }> { cryptos.LSK.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Dcr color={'MediumAquaMarine'}/> Decred <br/>
            <span className={ cryptos.DCR.PRICEDIRECTION }>${ cryptos.DCR.PRICE }</span>
            <span className={ cryptos.DCR.PCTCHANGE }> { cryptos.DCR.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Doge color={'orange'}/> Dogecoin <br/>
            <span className={ cryptos.DOGE.PRICEDIRECTION }>${ cryptos.DOGE.PRICE }</span>
            <span className={ cryptos.DOGE.PCTCHANGE }> { cryptos.DOGE.CHANGE24HOURPCT } </span>
          </li>
          <li>
            <Ppc color={'Green'}/> PeerCoin <br/>
            <span className={ cryptos.PPC.PRICEDIRECTION }>${ cryptos.PPC.PRICE }</span>
            <span className={ cryptos.PPC.PCTCHANGE }> { cryptos.PPC.CHANGE24HOURPCT } </span>
          </li>
        </ul>
      </div>
    );
  }
}

export default Ticker;
