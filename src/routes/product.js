import express from  "express";


const router  =   express.Router();

router.route("/product").post();
router.route("/product/:id").get().delete();
