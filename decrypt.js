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

function decrypt(text) {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

modifyTextFile("input.txt", "output.txt", decrypt);
