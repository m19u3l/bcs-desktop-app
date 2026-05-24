<?php
define('DS', "/");
define('DocRoot', $_SERVER['DOCUMENT_ROOT'].DS);
include DocRoot . 'AdminPanel'.DS.'Includes'.DS.'Index.php';

/**
 * @var string $templatesPath
 * @var string $baseUrl
 * @var string $assetsPath
 * @var string $componentsPath
 */

$inPageCssPath = $assetsPath . 'CSS'.DS.'OurProjects'.DS.'InPageCss.php';
$pageTitle = "Our Projects";
$breadcrumbs = [
    ['title' => 'Home', 'link' => $baseUrl],
    ['title' => $pageTitle, 'link' => ''],
];

ob_start();
?>
<div data-elementor-type="wp-page" data-elementor-id="300" class="elementor elementor-300"
     data-elementor-post-type="page">

    <?php include $componentsPath . 'InnerPageHeading.php' ?>

    <?php if(isset($sendSampleSubmitSuccess)){?>
        <div class="success-box">
            <span class="success-text"><?php echo $sendSampleSubmitSuccess ;?></span>
        </div>
    <?php }?>

    <section
            class="elementor-section elementor-top-section elementor-element elementor-element-26797b3 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="26797b3" data-element_type="section">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-6100c37"
                 data-id="6100c37" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-8360c38 elementor-grid-3 elementor-grid-tablet-2 elementor-grid-mobile-1 elementor-widget elementor-widget-loop-grid"
                         data-id="8360c38" data-element_type="widget"
                         data-settings="{&quot;template_id&quot;:&quot;6584&quot;,&quot;row_gap&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:68,&quot;sizes&quot;:[]},&quot;row_gap_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:40,&quot;sizes&quot;:[]},&quot;row_gap_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:30,&quot;sizes&quot;:[]},&quot;_skin&quot;:&quot;post&quot;,&quot;columns&quot;:&quot;3&quot;,&quot;columns_tablet&quot;:&quot;2&quot;,&quot;columns_mobile&quot;:&quot;1&quot;,&quot;edit_handle_selector&quot;:&quot;[data-elementor-type=\&quot;loop-item\&quot;]&quot;}"
                         data-widget_type="loop-grid.post">
                        <div class="elementor-widget-container">
                            <div class="elementor-loop-container elementor-grid">
                                <style id="loop-6584">.elementor-6584 .elementor-element.elementor-element-29d6aeb > .elementor-element-populated {
                                        padding: 0px 0px 0px 0px;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-181de38 img {
                                        width: 100%;
                                        border-radius: 10px 10px 10px 10px;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-59370fa .elementor-heading-title {
                                        font-size: 24px;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 .elementor-button {
                                        background-color: var(--e-global-color-56a7c9);
                                        font-size: 16px;
                                        font-weight: 400;
                                        fill: var(--e-global-color-12f8b0d);
                                        color: var(--e-global-color-12f8b0d);
                                        border-style: none;
                                        border-radius: 0px 0px 0px 0px;
                                        padding: 0px 0px 0px 0px;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 > .elementor-widget-container {
                                        margin: -10px 0px 0px 0px;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 .elementor-button-content-wrapper {
                                        flex-direction: row-reverse;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 .elementor-button .elementor-button-content-wrapper {
                                        gap: 8px;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 .elementor-button:hover, .elementor-6584 .elementor-element.elementor-element-7d89ca5 .elementor-button:focus {
                                        border-color: var(--e-global-color-56a7c9);
                                    }

                                    @media (max-width: 1024px) {
                                        .elementor-6584 .elementor-element.elementor-element-59370fa .elementor-heading-title {
                                            font-size: 22px;
                                        }
                                    }

                                    @media (max-width: 767px) {
                                        .elementor-6584 .elementor-element.elementor-element-59370fa .elementor-heading-title {
                                            font-size: 20px;
                                        }

                                        .elementor-6584 .elementor-element.elementor-element-7d89ca5 .elementor-button {
                                            font-size: 15px;
                                        }
                                    }

                                    /* Start custom CSS for button, class: .elementor-element-7d89ca5 */
                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 svg * {
                                        fill: var(--e-global-color-12f8b0d) !important;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 svg circle {
                                        fill: var(--e-global-color-4831827) !important;
                                        stroke: rgb(1, 99, 190) !important;
                                    }

                                    /* End custom CSS */</style>
                                <style id="elementor-post-6584">.elementor-6584 .elementor-element.elementor-element-29d6aeb > .elementor-element-populated {
                                        padding: 0px 0px 0px 0px;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-181de38 img {
                                        width: 100%;
                                        border-radius: 10px 10px 10px 10px;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-59370fa .elementor-heading-title {
                                        font-size: 24px;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 .elementor-button {
                                        background-color: var(--e-global-color-56a7c9);
                                        font-size: 16px;
                                        font-weight: 400;
                                        fill: var(--e-global-color-12f8b0d);
                                        color: var(--e-global-color-12f8b0d);
                                        border-style: none;
                                        border-radius: 0px 0px 0px 0px;
                                        padding: 0px 0px 0px 0px;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 > .elementor-widget-container {
                                        margin: -10px 0px 0px 0px;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 .elementor-button-content-wrapper {
                                        flex-direction: row-reverse;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 .elementor-button .elementor-button-content-wrapper {
                                        gap: 8px;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 .elementor-button:hover, .elementor-6584 .elementor-element.elementor-element-7d89ca5 .elementor-button:focus {
                                        border-color: var(--e-global-color-56a7c9);
                                    }

                                    @media (max-width: 1024px) {
                                        .elementor-6584 .elementor-element.elementor-element-59370fa .elementor-heading-title {
                                            font-size: 22px;
                                        }
                                    }

                                    @media (max-width: 767px) {
                                        .elementor-6584 .elementor-element.elementor-element-59370fa .elementor-heading-title {
                                            font-size: 20px;
                                        }

                                        .elementor-6584 .elementor-element.elementor-element-7d89ca5 .elementor-button {
                                            font-size: 15px;
                                        }
                                    }

                                    /* Start custom CSS for button, class: .elementor-element-7d89ca5 */
                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 svg * {
                                        fill: var(--e-global-color-12f8b0d) !important;
                                    }

                                    .elementor-6584 .elementor-element.elementor-element-7d89ca5 svg circle {
                                        fill: var(--e-global-color-4831827) !important;
                                        stroke: rgb(1, 99, 190) !important;
                                    }

                                    /* End custom CSS */</style>
                                <div data-elementor-type="loop-item" data-elementor-id="6584"
                                     class="elementor elementor-6584 e-loop-item e-loop-item-3798 post-3798 projects type-projects status-publish has-post-thumbnail hentry"
                                     data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
                                    <section
                                            class="elementor-section elementor-top-section elementor-element elementor-element-5d667b4 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                                            data-id="5d667b4" data-element_type="section">
                                        <div class="elementor-container elementor-column-gap-default">
                                            <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-29d6aeb"
                                                 data-id="29d6aeb" data-element_type="column">
                                                <div class="elementor-widget-wrap elementor-element-populated">
                                                    <div class="elementor-element elementor-element-181de38 elementor-widget elementor-widget-theme-post-featured-image elementor-widget-image"
                                                         data-id="181de38" data-element_type="widget"
                                                         data-widget_type="theme-post-featured-image.default">
                                                        <div class="elementor-widget-container">
                                                            <a href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjU2NzIiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
                                                                <img decoding="async" width="2560" height="1707"
                                                                     src="<?php echo $assetsUrl; ?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-scaled.jpg"
                                                                     class="attachment-full size-full wp-image-6568"
                                                                     alt="Construction Estimator Sydney"
                                                                     srcset="<?php echo $assetsUrl; ?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-scaled.jpg 2560w, <?php echo $assetsUrl; ?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-300x200.jpg 300w, <?php echo $assetsUrl; ?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-1024x683.jpg 1024w, <?php echo $assetsUrl; ?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-768x512.jpg 768w, <?php echo $assetsUrl; ?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-1536x1024.jpg 1536w, <?php echo $assetsUrl; ?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-2048x1365.jpg 2048w"
                                                                     sizes="(max-width: 2560px) 100vw, 2560px"/> </a>
                                                        </div>
                                                    </div>
                                                    <div class="elementor-element elementor-element-59370fa elementor-widget elementor-widget-theme-post-title elementor-page-title elementor-widget-heading"
                                                         data-id="59370fa" data-element_type="widget"
                                                         data-widget_type="theme-post-title.default">
                                                        <div class="elementor-widget-container">
                                                            <h2 class="elementor-heading-title elementor-size-default">
                                                                Residential Buildings</h2></div>
                                                    </div>
                                                    <div class="elementor-element elementor-element-7d89ca5 elementor-widget elementor-widget-button"
                                                         data-id="7d89ca5" data-element_type="widget"
                                                         data-widget_type="button.default">
                                                        <div class="elementor-widget-container">
                                                            <div class="elementor-button-wrapper">
                                                                <a class="elementor-button elementor-button-link elementor-size-sm"
                                                                   href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjU2NzIiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="15" viewBox="0 0 32 15" fill="none"><circle
                            cx="7.5" cy="7.5" r="7" stroke="#0163BE"></circle><path
                            d="M31.3536 8.35355C31.5488 8.15829 31.5488 7.84171 31.3536 7.64645L28.1716 4.46447C27.9763 4.2692 27.6597 4.2692 27.4645 4.46447C27.2692 4.65973 27.2692 4.97631 27.4645 5.17157L30.2929 8L27.4645 10.8284C27.2692 11.0237 27.2692 11.3403 27.4645 11.5355C27.6597 11.7308 27.9763 11.7308 28.1716 11.5355L31.3536 8.35355ZM7 8.5H31V7.5H7V8.5Z"
                            fill="#0163BE"></path></svg>			</span>
									<span class="elementor-button-text">Download Sample</span>
					</span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                <div data-elementor-type="loop-item" data-elementor-id="6584"
                                     class="elementor elementor-6584 e-loop-item e-loop-item-3799 post-3799 projects type-projects status-publish has-post-thumbnail hentry"
                                     data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
                                    <section
                                            class="elementor-section elementor-top-section elementor-element elementor-element-5d667b4 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                                            data-id="5d667b4" data-element_type="section">
                                        <div class="elementor-container elementor-column-gap-default">
                                            <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-29d6aeb"
                                                 data-id="29d6aeb" data-element_type="column">
                                                <div class="elementor-widget-wrap elementor-element-populated">
                                                    <div class="elementor-element elementor-element-181de38 elementor-widget elementor-widget-theme-post-featured-image elementor-widget-image"
                                                         data-id="181de38" data-element_type="widget"
                                                         data-widget_type="theme-post-featured-image.default">
                                                        <div class="elementor-widget-container">
                                                            <a href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjU2NzIiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
                                                                <img decoding="async" width="2560" height="1707"
                                                                     src="<?php echo $assetsUrl; ?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-scaled.jpg"
                                                                     class="attachment-full size-full wp-image-6563"
                                                                     alt="Building Estimator Melbourne"
                                                                     srcset="<?php echo $assetsUrl; ?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-scaled.jpg 2560w, <?php echo $assetsUrl; ?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-300x200.jpg 300w, <?php echo $assetsUrl; ?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-1024x683.jpg 1024w, <?php echo $assetsUrl; ?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-768x512.jpg 768w, <?php echo $assetsUrl; ?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-1536x1024.jpg 1536w, <?php echo $assetsUrl; ?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-2048x1365.jpg 2048w"
                                                                     sizes="(max-width: 2560px) 100vw, 2560px"/> </a>
                                                        </div>
                                                    </div>
                                                    <div class="elementor-element elementor-element-59370fa elementor-widget elementor-widget-theme-post-title elementor-page-title elementor-widget-heading"
                                                         data-id="59370fa" data-element_type="widget"
                                                         data-widget_type="theme-post-title.default">
                                                        <div class="elementor-widget-container">
                                                            <h2 class="elementor-heading-title elementor-size-default">
                                                                Commercial Buildings</h2></div>
                                                    </div>
                                                    <div class="elementor-element elementor-element-7d89ca5 elementor-widget elementor-widget-button"
                                                         data-id="7d89ca5" data-element_type="widget"
                                                         data-widget_type="button.default">
                                                        <div class="elementor-widget-container">
                                                            <div class="elementor-button-wrapper">
                                                                <a class="elementor-button elementor-button-link elementor-size-sm"
                                                                   href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjU2NzIiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="15" viewBox="0 0 32 15" fill="none"><circle
                            cx="7.5" cy="7.5" r="7" stroke="#0163BE"></circle><path
                            d="M31.3536 8.35355C31.5488 8.15829 31.5488 7.84171 31.3536 7.64645L28.1716 4.46447C27.9763 4.2692 27.6597 4.2692 27.4645 4.46447C27.2692 4.65973 27.2692 4.97631 27.4645 5.17157L30.2929 8L27.4645 10.8284C27.2692 11.0237 27.2692 11.3403 27.4645 11.5355C27.6597 11.7308 27.9763 11.7308 28.1716 11.5355L31.3536 8.35355ZM7 8.5H31V7.5H7V8.5Z"
                            fill="#0163BE"></path></svg>			</span>
									<span class="elementor-button-text">Download Sample</span>
					</span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                <div data-elementor-type="loop-item" data-elementor-id="6584"
                                     class="elementor elementor-6584 e-loop-item e-loop-item-3800 post-3800 projects type-projects status-publish has-post-thumbnail hentry"
                                     data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
                                    <section
                                            class="elementor-section elementor-top-section elementor-element elementor-element-5d667b4 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                                            data-id="5d667b4" data-element_type="section">
                                        <div class="elementor-container elementor-column-gap-default">
                                            <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-29d6aeb"
                                                 data-id="29d6aeb" data-element_type="column">
                                                <div class="elementor-widget-wrap elementor-element-populated">
                                                    <div class="elementor-element elementor-element-181de38 elementor-widget elementor-widget-theme-post-featured-image elementor-widget-image"
                                                         data-id="181de38" data-element_type="widget"
                                                         data-widget_type="theme-post-featured-image.default">
                                                        <div class="elementor-widget-container">
                                                            <a href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjU2NzIiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
                                                                <img loading="lazy" decoding="async" width="2560"
                                                                     height="1709"
                                                                     src="<?php echo $assetsUrl; ?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1.jpg"
                                                                     class="attachment-full size-full wp-image-7306"
                                                                     alt="Civil Construction"
                                                                     srcset="<?php echo $assetsUrl; ?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1.jpg 2560w, <?php echo $assetsUrl; ?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1-300x200.jpg 300w, <?php echo $assetsUrl; ?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1-1024x684.jpg 1024w, <?php echo $assetsUrl; ?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1-768x513.jpg 768w, <?php echo $assetsUrl; ?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1-1536x1025.jpg 1536w, <?php echo $assetsUrl; ?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1-2048x1367.jpg 2048w"
                                                                     sizes="(max-width: 2560px) 100vw, 2560px"/> </a>
                                                        </div>
                                                    </div>
                                                    <div class="elementor-element elementor-element-59370fa elementor-widget elementor-widget-theme-post-title elementor-page-title elementor-widget-heading"
                                                         data-id="59370fa" data-element_type="widget"
                                                         data-widget_type="theme-post-title.default">
                                                        <div class="elementor-widget-container">
                                                            <h2 class="elementor-heading-title elementor-size-default">
                                                                Civil Construction</h2></div>
                                                    </div>
                                                    <div class="elementor-element elementor-element-7d89ca5 elementor-widget elementor-widget-button"
                                                         data-id="7d89ca5" data-element_type="widget"
                                                         data-widget_type="button.default">
                                                        <div class="elementor-widget-container">
                                                            <div class="elementor-button-wrapper">
                                                                <a class="elementor-button elementor-button-link elementor-size-sm"
                                                                   href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjU2NzIiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="15" viewBox="0 0 32 15" fill="none"><circle
                            cx="7.5" cy="7.5" r="7" stroke="#0163BE"></circle><path
                            d="M31.3536 8.35355C31.5488 8.15829 31.5488 7.84171 31.3536 7.64645L28.1716 4.46447C27.9763 4.2692 27.6597 4.2692 27.4645 4.46447C27.2692 4.65973 27.2692 4.97631 27.4645 5.17157L30.2929 8L27.4645 10.8284C27.2692 11.0237 27.2692 11.3403 27.4645 11.5355C27.6597 11.7308 27.9763 11.7308 28.1716 11.5355L31.3536 8.35355ZM7 8.5H31V7.5H7V8.5Z"
                            fill="#0163BE"></path></svg>			</span>
									<span class="elementor-button-text">Download Sample</span>
					</span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                <div data-elementor-type="loop-item" data-elementor-id="6584"
                                     class="elementor elementor-6584 e-loop-item e-loop-item-3801 post-3801 projects type-projects status-publish has-post-thumbnail hentry"
                                     data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
                                    <section
                                            class="elementor-section elementor-top-section elementor-element elementor-element-5d667b4 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                                            data-id="5d667b4" data-element_type="section">
                                        <div class="elementor-container elementor-column-gap-default">
                                            <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-29d6aeb"
                                                 data-id="29d6aeb" data-element_type="column">
                                                <div class="elementor-widget-wrap elementor-element-populated">
                                                    <div class="elementor-element elementor-element-181de38 elementor-widget elementor-widget-theme-post-featured-image elementor-widget-image"
                                                         data-id="181de38" data-element_type="widget"
                                                         data-widget_type="theme-post-featured-image.default">
                                                        <div class="elementor-widget-container">
                                                            <a href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjU2NzIiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
                                                                <img loading="lazy" decoding="async" width="2560"
                                                                     height="1696"
                                                                     src="<?php echo $assetsUrl; ?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-scaled.jpg"
                                                                     class="attachment-full size-full wp-image-6570"
                                                                     alt="Home renovations"
                                                                     srcset="<?php echo $assetsUrl; ?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-scaled.jpg 2560w, <?php echo $assetsUrl; ?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-300x199.jpg 300w, <?php echo $assetsUrl; ?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-1024x678.jpg 1024w, <?php echo $assetsUrl; ?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-768x509.jpg 768w, <?php echo $assetsUrl; ?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-1536x1017.jpg 1536w, <?php echo $assetsUrl; ?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-2048x1356.jpg 2048w"
                                                                     sizes="(max-width: 2560px) 100vw, 2560px"/> </a>
                                                        </div>
                                                    </div>
                                                    <div class="elementor-element elementor-element-59370fa elementor-widget elementor-widget-theme-post-title elementor-page-title elementor-widget-heading"
                                                         data-id="59370fa" data-element_type="widget"
                                                         data-widget_type="theme-post-title.default">
                                                        <div class="elementor-widget-container">
                                                            <h2 class="elementor-heading-title elementor-size-default">
                                                                Home Construction</h2></div>
                                                    </div>
                                                    <div class="elementor-element elementor-element-7d89ca5 elementor-widget elementor-widget-button"
                                                         data-id="7d89ca5" data-element_type="widget"
                                                         data-widget_type="button.default">
                                                        <div class="elementor-widget-container">
                                                            <div class="elementor-button-wrapper">
                                                                <a class="elementor-button elementor-button-link elementor-size-sm"
                                                                   href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjU2NzIiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="15" viewBox="0 0 32 15" fill="none"><circle
                            cx="7.5" cy="7.5" r="7" stroke="#0163BE"></circle><path
                            d="M31.3536 8.35355C31.5488 8.15829 31.5488 7.84171 31.3536 7.64645L28.1716 4.46447C27.9763 4.2692 27.6597 4.2692 27.4645 4.46447C27.2692 4.65973 27.2692 4.97631 27.4645 5.17157L30.2929 8L27.4645 10.8284C27.2692 11.0237 27.2692 11.3403 27.4645 11.5355C27.6597 11.7308 27.9763 11.7308 28.1716 11.5355L31.3536 8.35355ZM7 8.5H31V7.5H7V8.5Z"
                            fill="#0163BE"></path></svg>			</span>
									<span class="elementor-button-text">Download Sample</span>
					</span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                <div data-elementor-type="loop-item" data-elementor-id="6584"
                                     class="elementor elementor-6584 e-loop-item e-loop-item-3797 post-3797 projects type-projects status-publish has-post-thumbnail hentry"
                                     data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
                                    <section
                                            class="elementor-section elementor-top-section elementor-element elementor-element-5d667b4 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                                            data-id="5d667b4" data-element_type="section">
                                        <div class="elementor-container elementor-column-gap-default">
                                            <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-29d6aeb"
                                                 data-id="29d6aeb" data-element_type="column">
                                                <div class="elementor-widget-wrap elementor-element-populated">
                                                    <div class="elementor-element elementor-element-181de38 elementor-widget elementor-widget-theme-post-featured-image elementor-widget-image"
                                                         data-id="181de38" data-element_type="widget"
                                                         data-widget_type="theme-post-featured-image.default">
                                                        <div class="elementor-widget-container">
                                                            <a href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjU2NzIiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
                                                                <img loading="lazy" decoding="async" width="2560"
                                                                     height="1704"
                                                                     src="<?php echo $assetsUrl; ?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-scaled.jpg"
                                                                     class="attachment-full size-full wp-image-6579"
                                                                     alt="Bridge Construction Process"
                                                                     srcset="<?php echo $assetsUrl; ?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-scaled.jpg 2560w, <?php echo $assetsUrl; ?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-300x200.jpg 300w, <?php echo $assetsUrl; ?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-1024x681.jpg 1024w, <?php echo $assetsUrl; ?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-768x511.jpg 768w, <?php echo $assetsUrl; ?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-1536x1022.jpg 1536w, <?php echo $assetsUrl; ?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-2048x1363.jpg 2048w"
                                                                     sizes="(max-width: 2560px) 100vw, 2560px"/> </a>
                                                        </div>
                                                    </div>
                                                    <div class="elementor-element elementor-element-59370fa elementor-widget elementor-widget-theme-post-title elementor-page-title elementor-widget-heading"
                                                         data-id="59370fa" data-element_type="widget"
                                                         data-widget_type="theme-post-title.default">
                                                        <div class="elementor-widget-container">
                                                            <h2 class="elementor-heading-title elementor-size-default">
                                                                Bridge Construction</h2></div>
                                                    </div>
                                                    <div class="elementor-element elementor-element-7d89ca5 elementor-widget elementor-widget-button"
                                                         data-id="7d89ca5" data-element_type="widget"
                                                         data-widget_type="button.default">
                                                        <div class="elementor-widget-container">
                                                            <div class="elementor-button-wrapper">
                                                                <a class="elementor-button elementor-button-link elementor-size-sm"
                                                                   href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjU2NzIiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="15" viewBox="0 0 32 15" fill="none"><circle
                            cx="7.5" cy="7.5" r="7" stroke="#0163BE"></circle><path
                            d="M31.3536 8.35355C31.5488 8.15829 31.5488 7.84171 31.3536 7.64645L28.1716 4.46447C27.9763 4.2692 27.6597 4.2692 27.4645 4.46447C27.2692 4.65973 27.2692 4.97631 27.4645 5.17157L30.2929 8L27.4645 10.8284C27.2692 11.0237 27.2692 11.3403 27.4645 11.5355C27.6597 11.7308 27.9763 11.7308 28.1716 11.5355L31.3536 8.35355ZM7 8.5H31V7.5H7V8.5Z"
                            fill="#0163BE"></path></svg>			</span>
									<span class="elementor-button-text">Download Sample</span>
					</span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                <div data-elementor-type="loop-item" data-elementor-id="6584"
                                     class="elementor elementor-6584 e-loop-item e-loop-item-3792 post-3792 projects type-projects status-publish has-post-thumbnail hentry"
                                     data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
                                    <section
                                            class="elementor-section elementor-top-section elementor-element elementor-element-5d667b4 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                                            data-id="5d667b4" data-element_type="section">
                                        <div class="elementor-container elementor-column-gap-default">
                                            <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-29d6aeb"
                                                 data-id="29d6aeb" data-element_type="column">
                                                <div class="elementor-widget-wrap elementor-element-populated">
                                                    <div class="elementor-element elementor-element-181de38 elementor-widget elementor-widget-theme-post-featured-image elementor-widget-image"
                                                         data-id="181de38" data-element_type="widget"
                                                         data-widget_type="theme-post-featured-image.default">
                                                        <div class="elementor-widget-container">
                                                            <a href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjU2NzIiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
                                                                <img loading="lazy" decoding="async" width="2560"
                                                                     height="1707"
                                                                     src="<?php echo $assetsUrl; ?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-scaled.jpg"
                                                                     class="attachment-full size-full wp-image-6574"
                                                                     alt="Kitchen Interior Design"
                                                                     srcset="<?php echo $assetsUrl; ?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-scaled.jpg 2560w, <?php echo $assetsUrl; ?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-300x200.jpg 300w, <?php echo $assetsUrl; ?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-1024x683.jpg 1024w, <?php echo $assetsUrl; ?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-768x512.jpg 768w, <?php echo $assetsUrl; ?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-1536x1024.jpg 1536w, <?php echo $assetsUrl; ?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-2048x1365.jpg 2048w"
                                                                     sizes="(max-width: 2560px) 100vw, 2560px"/> </a>
                                                        </div>
                                                    </div>
                                                    <div class="elementor-element elementor-element-59370fa elementor-widget elementor-widget-theme-post-title elementor-page-title elementor-widget-heading"
                                                         data-id="59370fa" data-element_type="widget"
                                                         data-widget_type="theme-post-title.default">
                                                        <div class="elementor-widget-container">
                                                            <h2 class="elementor-heading-title elementor-size-default">
                                                                Kitchen construction</h2></div>
                                                    </div>
                                                    <div class="elementor-element elementor-element-7d89ca5 elementor-widget elementor-widget-button"
                                                         data-id="7d89ca5" data-element_type="widget"
                                                         data-widget_type="button.default">
                                                        <div class="elementor-widget-container">
                                                            <div class="elementor-button-wrapper">
                                                                <a class="elementor-button elementor-button-link elementor-size-sm"
                                                                   href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjU2NzIiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="15" viewBox="0 0 32 15" fill="none"><circle
                            cx="7.5" cy="7.5" r="7" stroke="#0163BE"></circle><path
                            d="M31.3536 8.35355C31.5488 8.15829 31.5488 7.84171 31.3536 7.64645L28.1716 4.46447C27.9763 4.2692 27.6597 4.2692 27.4645 4.46447C27.2692 4.65973 27.2692 4.97631 27.4645 5.17157L30.2929 8L27.4645 10.8284C27.2692 11.0237 27.2692 11.3403 27.4645 11.5355C27.6597 11.7308 27.9763 11.7308 28.1716 11.5355L31.3536 8.35355ZM7 8.5H31V7.5H7V8.5Z"
                            fill="#0163BE"></path></svg>			</span>
									<span class="elementor-button-text">Download Sample</span>
					</span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>


<?php
$mainContent = ob_get_clean();
require_once $templatesPath . 'InnerPage.php';
?>

