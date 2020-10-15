const fs = require('fs');
const jwt = require("jsonwebtoken");
const request = require('request');
const QRCode = require('qrcode');
const execSync = require('child_process').execSync;

// 定数セット
const auth = JSON.parse(fs.readFileSync('auth.json'));
const apiKey = auth.publicKey;
const apiSecret = auth.secretKey;
const userId = auth.userId;

// jwt取得
const jwtToken = jwt.sign({
    iss: apiKey, // 発行者
    exp: Date.now() + 3600 // jwt失効期限
  }, 
  apiSecret
);

// zoom meeting作成
const URL = `https://api.zoom.us/v2/users/${userId}/meetings`;
request.post({
    uri: URL,
    headers: { 
      "Content-type": "application/json", 
      "Authorization": `Bearer  ${jwtToken}`
    },
    json: {
      'type': 1, // instant meeting
      'timezone': 'Asia/Tokyo'
    }
  }, (err, res, data) => {
    const url = data['join_url'];
    fs.readdir('./output', (err, files) => {
      QRCode.toFile(`./output/qr_code_${files.length}.png`, url);
    });
    console.info(url)
    execSync(`open ./output`);
  }
);
