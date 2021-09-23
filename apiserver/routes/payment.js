const router = require("express").Router();
var Iyzipay = require('iyzipay');

// Development Credentials
var iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: 'https://sandbox-api.iyzipay.com'
});

// Production Credentials
// var iyzipay = new Iyzipay({
//     apiKey: "prod-apiKey",s
//     secretKey: "prod-secretKey",
//     uri: 'https://api.iyzipay.com'
// });


// First request
router.post("/make-payment", async (req, res, next) => {
  try {
    // pull in necessary data here
    const { data } = req.body;

    // in case you may have to format the credit card info
    // const formattedGsmNo = "+" + (5555555555).replace(/\s/g, '');   // format GSM number for Iyzico's requested format
    // const formattedCardNuber = cardNumber.replace(/\s/g, '');  // remove spaces from card number
    // const formattedCardMonth = cardExpiry.slice(0, 2);  // pull in the expiry month from cardExpiry
    // const formattedCardYear = "20" + cardExpiry.slice(3, 5)  // pull in the expiry year from cardExpiry

    // you can generate some data and pass it in via callback URL
    const someData = 1;
    // create request object
    var request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: '123456789',
      price: '1',
      paidPrice: '1.2',
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: 'B67832',
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `http://localhost:8000/api/payment/callback/${someData}`,  // dev
      //callbackUrl: `https://somewbsite.com/api/payment/callback/${someData}`, // prod
      paymentCard: {
        cardHolderName: 'John Doe',
        cardNumber: '5528790000000008',
        expireMonth: '12',
        expireYear: '2030',
        cvc: '123',
        registerCard: '0'
      },
      buyer: {
        id: 'BY789',
        name: 'John',
        surname: 'Doe',
        gsmNumber: '+905350000000',
        email: 'email@email.com',
        identityNumber: '74300864791',
        lastLoginDate: '2015-10-05 12:43:35',
        registrationDate: '2013-04-21 15:12:09',
        registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742'
      },
      billingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742'
      },
      basketItems: [
        {
          id: 'BI101',
          name: 'Binocular',
          category1: 'Collectibles',
          category2: 'Accessories',
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: '0.5'
        },
        {
          id: 'BI102',
          name: 'Game code',
          category1: 'Game',
          category2: 'Online Game Items',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: '0.5'
        }
      ]
    };

    // send the request to get 3ds html content
    iyzipay.threedsInitialize.create(request, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result.status == "success") {
        // console.log(result)
        // {
        //   status: 'success',
        //   locale: 'tr',
        //   systemTime: 1632426689145,
        //   conversationId: '123456789',
        //   threeDSHtmlContent: 'a long sequence of chars'
        // }
        // decode threedscontent from base64 to html
        let buff = Buffer.from(result.threeDSHtmlContent, 'base64');
        res.send(buff)
      } else {
        // handle/log error and send feedback to the user
        // console.log(result.errorMessage)
        res.status(400).send({ message: "Lütfen bilgilerinizi kontrol edip tekrar deneyiniz!" })
      }
    });
  } catch (err) {
    console.log(err);
    next(err)
  }
});

//Sending the checkout form 
router.post("/callback/:someData", (req, res) => {
  // catch the data that you pass via callback url
  const { someData } = req.params;
  try {
    var conversationId = req.body.conversationId;
    var paymentId = req.body.paymentId;
    var request = {
      conversationId: String(conversationId),
      locale: Iyzipay.LOCALE.TR,
      paymentId: paymentId,
    };
    iyzipay.threedsPayment.create(request, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result.status === "success") {
        // console.log("final result", result)
        //example result
        // {
        //    status: 'success',
        //    locale: 'tr',
        //    systemTime: 1632385272336,
        //    conversationId: '653',
        //    price: 70.5,
        //    paidPrice: 70.5,
        //    installment: 1,
        //    paymentId: '16573135',
        //    fraudStatus: 1,
        //    merchantCommissionRate: 0,
        //    merchantCommissionRateAmount: 0,
        //    iyziCommissionRateAmount: 2.82,
        //    iyziCommissionFee: 0.25,
        //    cardType: 'CREDIT_CARD',
        //    cardAssociation: 'MASTER_CARD',
        //    cardFamily: 'Paraf',
        //    binNumber: '552879',
        //    lastFourDigits: '0008',
        //    currency: 'TRY',
        //    itemTransactions: [
        //      {
        //        itemId: '6',
        //        paymentTransactionId: '17354740',
        //        transactionStatus: 2,
        //        price: 70.5,
        //        paidPrice: 70.5,
        //        merchantCommissionRate: 0,
        //        merchantCommissionRateAmount: 0,
        //        iyziCommissionRateAmount: 2.82,
        //        iyziCommissionFee: 0.25,
        //        blockageRate: 0,
        //        blockageRateAmountMerchant: 0,
        //        blockageRateAmountSubMerchant: 0,
        //        blockageResolvedDate: '2021-10-01 00:00:00',
        //        subMerchantPrice: 0,
        //        subMerchantPayoutRate: 0,
        //        subMerchantPayoutAmount: 0,
        //        merchantPayoutAmount: 67.43,
        //        convertedPayout: [Object]
        //      }
        //    ],
        //    authCode: '271252',
        //    phase: 'AUTH',
        //    mdStatus: 1,
        //    hostReference: 'mock00001iyzihostrfn'
        //  }

        // save necessary data and send success feedback for the user
        res.send("<center><h2 style='color: blue; margin-top: 175px;'><b>Ödemeniz başarıyla alınmıştır.</b></h2></center>")
      } else {
        // handle/log error and send feedback to the user
        // console.log(result.errorMessage);
        res.send("<center><h2 style='color: red; margin-top: 175px;'><b>Ödemede bir hata oluştu!</b></h2></center>")
      }
    });
  } catch (err) {
    console.log(err);
    next(err)
  }
})

module.exports = router;







