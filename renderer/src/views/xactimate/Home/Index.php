<?php
define('DS', "/");
define('DocRoot', $_SERVER['DOCUMENT_ROOT'].DS);
include DocRoot.'AdminPanel'.DS.'Includes'.DS.'Index.php';
/**
 * @var string $templatesPath
 * @var string $componentsPath
 */

$homePath = $componentsPath.'Home'.DS;
$inPageCssPath = $assetsPath.'CSS'.DS.'Home'.DS.'InPageCss.php';
ob_start();
?>
<div data-elementor-type="wp-page" data-elementor-id="300" class="elementor elementor-300"
     data-elementor-post-type="page">
    <?php include $homePath.'Section1.php';?>
    <?php include $homePath.'Section2.php';?>
    <?php include $homePath.'Section3.php';?>
    <?php include $homePath.'Section4.php';?>
    <?php include $homePath.'Section5.php';?>
    <?php include $homePath.'SectionFAQ.php';?>
    <?php include $homePath.'Section6.php';?>
    <?php include $homePath.'Section7.php';?>
    <?php include $homePath.'Section8.php';?>
    <?php include $homePath.'Section9.php';?>
    <?php include $homePath.'Section10.php';?>
    <?php include $homePath.'Section11.php';?>
    <?php include $homePath.'Section12.php';?>
    <?php include $homePath.'Section13.php';?>
    <?php include $homePath.'Section14.php';?>
    <?php include $homePath.'Section15.php';?>

</div>


<?php
$mainContent = ob_get_clean();
require_once $templatesPath.'HomePage.php';
?>

