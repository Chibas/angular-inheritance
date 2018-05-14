<?php

/* @var $this \yii\web\View */

/* @var $content string */

use yii\helpers\Html;

?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <?= Html::csrfMetaTags() ?>

    <title><?= Html::encode($this->title) ?></title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">

    <link rel="shortcut icon" href="favicon.ico">
    <link rel="icon" type="image/x-icon" href="favicon.ico">


    <?php $this->head() ?>

    <base href="/">
</head>
<body>
<?php $this->beginBody() ?>
<?= $content ?>
<?php $this->endBody() ?>


<link rel='stylesheet' href='/assets/css/font-awesome.min.css' type='text/css' media='all'/>
<link rel='stylesheet' href='/assets/css/bootstrap.min.css' type='text/css' media='all'/>
<link rel='stylesheet' href='/assets/css/style.css' type='text/css' media='all'/>
<link rel="stylesheet" type="text/css" href="assets/css/picker.min.css" />
<!-- <link rel="stylesheet" href="assets/css/bootstrap-select.min.css"> -->

<script type='text/javascript' src='/assets/js/jquery-2.2.0.min.js'></script>
<script type='text/javascript' src='/assets/js/bootstrap.min.js'></script>
<!-- <script type='text/javascript' src='/assets/js/bootstrap-select.min.js'></script> -->
<script src="https://js.stripe.com/v2/"></script>

</body>
</html>
<?php $this->endPage() ?>
