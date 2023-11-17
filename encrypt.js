const fs = require("fs");
const crypto = require("crypto");

const passphrase = 'LTTA_VERY_FAT';
const salt = 'AND_SO_IS_TTBA';  

const key = crypto.scryptSync(passphrase, salt, 32);
const IV_LENGTH = 16;

function modifyTextFile(inputFile, outputFile, modifyFunction) {
  fs.readFile(inputFile, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    let modifiedData = modifyFunction(data);

    fs.writeFile(outputFile, modifiedData, "utf8", function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  });
}

function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

modifyTextFile("input.txt", "output.txt", encrypt);
