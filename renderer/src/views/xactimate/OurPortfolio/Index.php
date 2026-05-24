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

$inPageCssPath = $assetsPath . 'CSS'.DS.'OurPortfolio'.DS.'InPageCss.php';
$pageTitle = "Our Portfolio";
$breadcrumbs = [
    ['title' => 'Home', 'link' => $baseUrl],
    ['title' => $pageTitle, 'link' => ''],
];

ob_start();
?>
<div data-elementor-type="wp-page" data-elementor-id="300" class="elementor elementor-300"
     data-elementor-post-type="page">

    <?php include $componentsPath . 'InnerPageHeading.php' ?>

    <section
            class="elementor-section elementor-top-section elementor-element elementor-element-cb360a6 elementor-section-content-middle elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="cb360a6" data-element_type="section">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-2a396a7"
                 data-id="2a396a7" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-c77eb84 elementor-invisible elementor-widget elementor-widget-image"
                         data-id="c77eb84" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInLeft&quot;}"
                         data-widget_type="image.default">
                        <div class="elementor-widget-container">
                            <img decoding="async" width="558" height="397"
                                 src="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-19-1.png"
                                 class="attachment-full size-full wp-image-2892" alt="Our Portfolio"
                                 srcset="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-19-1.png 558w, <?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-19-1-300x213.png 300w"
                                 sizes="(max-width: 558px) 100vw, 558px"/></div>
                    </div>
                </div>
            </div>
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-bdaff2a elementor-invisible"
                 data-id="bdaff2a" data-element_type="column"
                 data-settings="{&quot;animation&quot;:&quot;fadeInRight&quot;}">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-b760dd9 elementor-widget elementor-widget-heading"
                         data-id="b760dd9" data-element_type="widget" data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Our <span>Portfolio</span></h2>
                        </div>
                    </div>
                    <div class="elementor-element elementor-element-ea71d1c elementor-widget__width-inherit elementor-widget elementor-widget-text-editor"
                         data-id="ea71d1c" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            <p>At Construct Estimates, our sound experience and ability to handle technically complex
                                construction projects have empowered us to provide construction cost estimating and
                                consultation services across a wide range of portfolios. From mixed and multi-use
                                residential developments to commercial, industrial, retail, institutional, civil, public
                                works, airports, highways, parks, recreation, mining, and marine projects, we have a
                                proven track record of success. We are proud to have worked with major public
                                organizations and have established ourselves as a trusted partner in the construction
                                industry. Our team of quantity surveyors, engineers, and estimators collaborates closely
                                with clients to ensure smooth construction processes and avoid any unexpected surprises
                                along the way.</p></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section
            class="elementor-section elementor-top-section elementor-element elementor-element-6965e15 elementor-section-content-middle elementor-reverse-mobile elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="6965e15" data-element_type="section"
            data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-b007bde elementor-invisible"
                 data-id="b007bde" data-element_type="column"
                 data-settings="{&quot;animation&quot;:&quot;fadeInLeft&quot;}">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-19a2818 elementor-widget elementor-widget-heading"
                         data-id="19a2818" data-element_type="widget" data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Your <span>Trusted Partner<span>
                            </h2></div>
                    </div>
                    <div class="elementor-element elementor-element-827d185 elementor-widget__width-inherit elementor-widget elementor-widget-text-editor"
                         data-id="827d185" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            <p>At Construct Estimates, we have built a strong reputation for accuracy and affordability.
                                With a diverse client base across the USA, and Australia, we are committed to delivering
                                exceptional results under one roof. From preliminary feasibility studies and design
                                phase estimates to timely bid preparation, our construction estimating services are
                                tailored to your specific needs. We prioritize high-quality cost estimating while
                                keeping the burden on your pocket to a minimum.<br/>From access doors to panels, sliding
                                doors to storefronts, and curtain walls to skylights, we cover the full spectrum of
                                opening requirements in the construction industry. Our comprehensive estimating services
                                extend to specialized openings, such as hangar doors, coiling doors, grilles, ceiling,
                                and smoke containment systems. Whatever your project demands, we have the knowledge and
                                resources to provide you with reliable estimates that empower you to make informed
                                decisions.</p></div>
                    </div>
                </div>
            </div>
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-9aa3b00 elementor-invisible"
                 data-id="9aa3b00" data-element_type="column"
                 data-settings="{&quot;animation&quot;:&quot;fadeInRight&quot;}">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-fcc501c elementor-widget elementor-widget-image"
                         data-id="fcc501c" data-element_type="widget" data-widget_type="image.default">
                        <div class="elementor-widget-container">
                            <img decoding="async" width="558" height="436"
                                 src="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-20-1.png"
                                 class="attachment-full size-full wp-image-2902" alt="Trusted Partner"
                                 srcset="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-20-1.png 558w, <?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-20-1-300x234.png 300w"
                                 sizes="(max-width: 558px) 100vw, 558px"/></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section
            class="elementor-section elementor-top-section elementor-element elementor-element-8e1796c elementor-section-content-middle elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="8e1796c" data-element_type="section">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-6a6eeed"
                 data-id="6a6eeed" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-2dd3759 elementor-invisible elementor-widget elementor-widget-image"
                         data-id="2dd3759" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInLeft&quot;}"
                         data-widget_type="image.default">
                        <div class="elementor-widget-container">
                            <img loading="lazy" decoding="async" width="558" height="397"
                                 src="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-21-1.png"
                                 class="attachment-full size-full wp-image-2915" alt="A Diverse Portfolio"
                                 srcset="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-21-1.png 558w, <?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-21-1-300x213.png 300w"
                                 sizes="(max-width: 558px) 100vw, 558px"/></div>
                    </div>
                </div>
            </div>
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-e984f55 elementor-invisible"
                 data-id="e984f55" data-element_type="column"
                 data-settings="{&quot;animation&quot;:&quot;fadeInRight&quot;}">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-1ff6b9b elementor-widget elementor-widget-heading"
                         data-id="1ff6b9b" data-element_type="widget" data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">A Diverse <span>Portfolio</span>
                            </h2></div>
                    </div>
                    <div class="elementor-element elementor-element-6cf2033 elementor-widget__width-inherit elementor-widget elementor-widget-text-editor"
                         data-id="6cf2033" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            Our portfolio is a testament to our expertise across various sectors. From renovations,
                            additions, and mixed-use residential and commercial buildings to airports, highways, marine
                            projects, and more, we have successfully delivered cost estimating and takeoff services that
                            exceed expectations. We are proud to have contributed to major public projects, working with
                            renowned organizations such as the Texas Department of Transportation (TxDOT), the
                            Metropolitan Transportation Authority (MTA), and the Environmental Protection Agency (EPA).
                            Whether you&#8217;re a general contractor, subcontractor, architect, designer, developer,
                            investor, vendor, or owner, our services are designed to meet your unique requirements.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section
            class="elementor-section elementor-top-section elementor-element elementor-element-2d9939a elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="2d9939a" data-element_type="section">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-b4e589d"
                 data-id="b4e589d" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-8443823 elementor-invisible elementor-widget elementor-widget-heading"
                         data-id="8443823" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;}" data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Experience Across a Wide Range of
                                <span>Construction Projects</span></h2></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section
            class="elementor-section elementor-top-section elementor-element elementor-element-a293ab3 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="a293ab3" data-element_type="section"
            data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-a21125e"
                 data-id="a21125e" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <section
                            class="elementor-section elementor-inner-section elementor-element elementor-element-8277ca7 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                            data-id="8277ca7" data-element_type="section">
                        <div class="elementor-container elementor-column-gap-default">
                            <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-332b746"
                                 data-id="332b746" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-a402162 elementor-grid-3 elementor-grid-tablet-2 elementor-grid-mobile-1 elementor-posts--thumbnail-top elementor-invisible elementor-widget elementor-widget-posts"
                                         data-id="a402162" data-element_type="widget"
                                         data-settings="{&quot;classic_row_gap&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:75,&quot;sizes&quot;:[]},&quot;classic_row_gap_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:40,&quot;sizes&quot;:[]},&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;classic_columns&quot;:&quot;3&quot;,&quot;classic_columns_tablet&quot;:&quot;2&quot;,&quot;classic_columns_mobile&quot;:&quot;1&quot;,&quot;classic_row_gap_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]}}"
                                         data-widget_type="posts.classic">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-posts-container elementor-posts elementor-posts--skin-classic elementor-grid">
                                                <article
                                                        class="elementor-post elementor-grid-item post-3798 projects type-projects status-publish has-post-thumbnail hentry">
                                                    <a class="elementor-post__thumbnail__link"
                                                       href="../projects/residential-buildings/index.html"
                                                       tabindex="-1">
                                                        <div class="elementor-post__thumbnail"><img loading="lazy"
                                                                                                    decoding="async"
                                                                                                    width="2560"
                                                                                                    height="1707"
                                                                                                    src="<?php echo $assetsUrl;?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-scaled.jpg"
                                                                                                    class="attachment-full size-full wp-image-6568"
                                                                                                    alt="Construction Estimator Sydney"
                                                                                                    srcset="<?php echo $assetsUrl;?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-scaled.jpg 2560w, <?php echo $assetsUrl;?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-300x200.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-1024x683.jpg 1024w, <?php echo $assetsUrl;?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-768x512.jpg 768w, <?php echo $assetsUrl;?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-1536x1024.jpg 1536w, <?php echo $assetsUrl;?>uploads/2023/08/kelvin-zyteng-LMq-rTluKfQ-unsplash-1-2048x1365.jpg 2048w"
                                                                                                    sizes="(max-width: 2560px) 100vw, 2560px"/>
                                                        </div>
                                                    </a>
                                                    <div class="elementor-post__text">
                                                        <h3 class="elementor-post__title">
                                                            <a href="../projects/residential-buildings/index.html">
                                                                Residential Buildings </a>
                                                        </h3>
                                                        <div class="elementor-post__excerpt">
                                                            <p>Get Colored Markups/PDFs for your takeoffs. Build out
                                                                realistic budgets that you can trust&#8230;</p>
                                                        </div>

                                                        <a class="elementor-post__read-more"
                                                           href="../projects/residential-buildings/index.html"
                                                           aria-label="Read more about Residential Buildings"
                                                           tabindex="-1">
                                                            Read More<img decoding="async"
                                                                          src="<?php echo $assetsUrl;?>uploads/2023/07/Group-237681-2.svg">
                                                        </a>

                                                    </div>
                                                </article>
                                                <article
                                                        class="elementor-post elementor-grid-item post-3799 projects type-projects status-publish has-post-thumbnail hentry">
                                                    <a class="elementor-post__thumbnail__link"
                                                       href="../projects/commercial-buildings/index.html" tabindex="-1">
                                                        <div class="elementor-post__thumbnail"><img loading="lazy"
                                                                                                    decoding="async"
                                                                                                    width="2560"
                                                                                                    height="1707"
                                                                                                    src="<?php echo $assetsUrl;?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-scaled.jpg"
                                                                                                    class="attachment-full size-full wp-image-6563"
                                                                                                    alt="Building Estimator Melbourne"
                                                                                                    srcset="<?php echo $assetsUrl;?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-scaled.jpg 2560w, <?php echo $assetsUrl;?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-300x200.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-1024x683.jpg 1024w, <?php echo $assetsUrl;?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-768x512.jpg 768w, <?php echo $assetsUrl;?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-1536x1024.jpg 1536w, <?php echo $assetsUrl;?>uploads/2023/08/frans-ruiter-x1Py2nXR-wc-unsplash-2048x1365.jpg 2048w"
                                                                                                    sizes="(max-width: 2560px) 100vw, 2560px"/>
                                                        </div>
                                                    </a>
                                                    <div class="elementor-post__text">
                                                        <h3 class="elementor-post__title">
                                                            <a href="../projects/commercial-buildings/index.html">
                                                                Commercial Buildings </a>
                                                        </h3>
                                                        <div class="elementor-post__excerpt">
                                                            <p>Get Colored Markups/PDFs for your takeoffs. Build out
                                                                realistic budgets that you can trust&#8230;</p>
                                                        </div>

                                                        <a class="elementor-post__read-more"
                                                           href="../projects/commercial-buildings/index.html"
                                                           aria-label="Read more about Commercial Buildings"
                                                           tabindex="-1">
                                                            Read More<img decoding="async"
                                                                          src="<?php echo $assetsUrl;?>uploads/2023/07/Group-237681-2.svg">
                                                        </a>

                                                    </div>
                                                </article>
                                                <article
                                                        class="elementor-post elementor-grid-item post-3800 projects type-projects status-publish has-post-thumbnail hentry">
                                                    <a class="elementor-post__thumbnail__link"
                                                       href="../projects/civil-construction/index.html" tabindex="-1">
                                                        <div class="elementor-post__thumbnail"><img loading="lazy"
                                                                                                    decoding="async"
                                                                                                    width="2560"
                                                                                                    height="1709"
                                                                                                    src="<?php echo $assetsUrl;?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1.jpg"
                                                                                                    class="attachment-full size-full wp-image-7306"
                                                                                                    alt="Civil Construction"
                                                                                                    srcset="<?php echo $assetsUrl;?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1.jpg 2560w, <?php echo $assetsUrl;?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1-300x200.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1-1024x684.jpg 1024w, <?php echo $assetsUrl;?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1-768x513.jpg 768w, <?php echo $assetsUrl;?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1-1536x1025.jpg 1536w, <?php echo $assetsUrl;?>uploads/2023/08/chuttersnap-NMrUtSA7094-unsplash-1-scaled-1-2048x1367.jpg 2048w"
                                                                                                    sizes="(max-width: 2560px) 100vw, 2560px"/>
                                                        </div>
                                                    </a>
                                                    <div class="elementor-post__text">
                                                        <h3 class="elementor-post__title">
                                                            <a href="../projects/civil-construction/index.html">
                                                                Civil Construction </a>
                                                        </h3>
                                                        <div class="elementor-post__excerpt">
                                                            <p>Get Colored Markups/PDFs for your takeoffs. Build out
                                                                realistic budgets that you can trust&#8230;</p>
                                                        </div>

                                                        <a class="elementor-post__read-more"
                                                           href="../projects/civil-construction/index.html"
                                                           aria-label="Read more about Civil Construction"
                                                           tabindex="-1">
                                                            Read More<img decoding="async"
                                                                          src="<?php echo $assetsUrl;?>uploads/2023/07/Group-237681-2.svg">
                                                        </a>

                                                    </div>
                                                </article>
                                                <article
                                                        class="elementor-post elementor-grid-item post-3801 projects type-projects status-publish has-post-thumbnail hentry">
                                                    <a class="elementor-post__thumbnail__link"
                                                       href="../projects/home-construction/index.html" tabindex="-1">
                                                        <div class="elementor-post__thumbnail"><img loading="lazy"
                                                                                                    decoding="async"
                                                                                                    width="2560"
                                                                                                    height="1696"
                                                                                                    src="<?php echo $assetsUrl;?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-scaled.jpg"
                                                                                                    class="attachment-full size-full wp-image-6570"
                                                                                                    alt="Home renovations"
                                                                                                    srcset="<?php echo $assetsUrl;?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-scaled.jpg 2560w, <?php echo $assetsUrl;?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-300x199.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-1024x678.jpg 1024w, <?php echo $assetsUrl;?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-768x509.jpg 768w, <?php echo $assetsUrl;?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-1536x1017.jpg 1536w, <?php echo $assetsUrl;?>uploads/2023/08/jens-behrmann-Iy3OdKaszJs-unsplash-1-2048x1356.jpg 2048w"
                                                                                                    sizes="(max-width: 2560px) 100vw, 2560px"/>
                                                        </div>
                                                    </a>
                                                    <div class="elementor-post__text">
                                                        <h3 class="elementor-post__title">
                                                            <a href="../projects/home-construction/index.html">
                                                                Home Construction </a>
                                                        </h3>
                                                        <div class="elementor-post__excerpt">
                                                            <p>Get Colored Markups/PDFs for your takeoffs. Build out
                                                                realistic budgets that you can trust&#8230;</p>
                                                        </div>

                                                        <a class="elementor-post__read-more"
                                                           href="../projects/home-construction/index.html"
                                                           aria-label="Read more about Home Construction" tabindex="-1">
                                                            Read More<img decoding="async"
                                                                          src="<?php echo $assetsUrl;?>uploads/2023/07/Group-237681-2.svg">
                                                        </a>

                                                    </div>
                                                </article>
                                                <article
                                                        class="elementor-post elementor-grid-item post-3797 projects type-projects status-publish has-post-thumbnail hentry">
                                                    <a class="elementor-post__thumbnail__link"
                                                       href="../projects/bridge-construction/index.html" tabindex="-1">
                                                        <div class="elementor-post__thumbnail"><img loading="lazy"
                                                                                                    decoding="async"
                                                                                                    width="2560"
                                                                                                    height="1704"
                                                                                                    src="<?php echo $assetsUrl;?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-scaled.jpg"
                                                                                                    class="attachment-full size-full wp-image-6579"
                                                                                                    alt="Bridge Construction Process"
                                                                                                    srcset="<?php echo $assetsUrl;?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-scaled.jpg 2560w, <?php echo $assetsUrl;?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-300x200.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-1024x681.jpg 1024w, <?php echo $assetsUrl;?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-768x511.jpg 768w, <?php echo $assetsUrl;?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-1536x1022.jpg 1536w, <?php echo $assetsUrl;?>uploads/2023/08/alexander-schimmeck-VWDwCIITqO8-unsplash-1-2048x1363.jpg 2048w"
                                                                                                    sizes="(max-width: 2560px) 100vw, 2560px"/>
                                                        </div>
                                                    </a>
                                                    <div class="elementor-post__text">
                                                        <h3 class="elementor-post__title">
                                                            <a href="../projects/bridge-construction/index.html">
                                                                Bridge Construction </a>
                                                        </h3>
                                                        <div class="elementor-post__excerpt">
                                                            <p>Get Colored Markups/PDFs for your takeoffs. Build out
                                                                realistic budgets that you can trust&#8230;</p>
                                                        </div>

                                                        <a class="elementor-post__read-more"
                                                           href="../projects/bridge-construction/index.html"
                                                           aria-label="Read more about Bridge Construction"
                                                           tabindex="-1">
                                                            Read More<img decoding="async"
                                                                          src="<?php echo $assetsUrl;?>uploads/2023/07/Group-237681-2.svg">
                                                        </a>

                                                    </div>
                                                </article>
                                                <article
                                                        class="elementor-post elementor-grid-item post-3792 projects type-projects status-publish has-post-thumbnail hentry">
                                                    <a class="elementor-post__thumbnail__link"
                                                       href="../projects/kitchen-construction/index.html" tabindex="-1">
                                                        <div class="elementor-post__thumbnail"><img loading="lazy"
                                                                                                    decoding="async"
                                                                                                    width="2560"
                                                                                                    height="1707"
                                                                                                    src="<?php echo $assetsUrl;?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-scaled.jpg"
                                                                                                    class="attachment-full size-full wp-image-6574"
                                                                                                    alt="Kitchen Interior Design"
                                                                                                    srcset="<?php echo $assetsUrl;?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-scaled.jpg 2560w, <?php echo $assetsUrl;?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-300x200.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-1024x683.jpg 1024w, <?php echo $assetsUrl;?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-768x512.jpg 768w, <?php echo $assetsUrl;?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-1536x1024.jpg 1536w, <?php echo $assetsUrl;?>uploads/2023/08/sidekix-media-_AK42TQRyCw-unsplash-1-2048x1365.jpg 2048w"
                                                                                                    sizes="(max-width: 2560px) 100vw, 2560px"/>
                                                        </div>
                                                    </a>
                                                    <div class="elementor-post__text">
                                                        <h3 class="elementor-post__title">
                                                            <a href="../projects/kitchen-construction/index.html">
                                                                Kitchen construction </a>
                                                        </h3>
                                                        <div class="elementor-post__excerpt">
                                                            <p>Get Colored Markups/PDFs for your takeoffs. Build out
                                                                realistic budgets that you can trust&#8230;</p>
                                                        </div>

                                                        <a class="elementor-post__read-more"
                                                           href="../projects/kitchen-construction/index.html"
                                                           aria-label="Read more about Kitchen construction"
                                                           tabindex="-1">
                                                            Read More<img decoding="async"
                                                                          src="<?php echo $assetsUrl;?>uploads/2023/07/Group-237681-2.svg">
                                                        </a>

                                                    </div>
                                                </article>
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
    </section>
    <section
            class="elementor-section elementor-top-section elementor-element elementor-element-ae821b8 elementor-section-content-middle elementor-reverse-mobile elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="ae821b8" data-element_type="section"
            data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-eff6498 elementor-invisible"
                 data-id="eff6498" data-element_type="column"
                 data-settings="{&quot;animation&quot;:&quot;fadeInLeft&quot;}">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-4803ee1 elementor-widget elementor-widget-heading"
                         data-id="4803ee1" data-element_type="widget" data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Your Success is <span>Our Priority</span>
                            </h2></div>
                    </div>
                    <div class="elementor-element elementor-element-74bf69a elementor-widget__width-inherit elementor-widget elementor-widget-text-editor"
                         data-id="74bf69a" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            <p>At Construct Estimates, our diversified portfolio reflects our commitment to excellence
                                and our ability to adapt to the unique demands of each construction project. We pride
                                ourselves on delivering accurate cost estimates and providing valuable insights that
                                consistently exceed our clients&#8217; expectations. Explore our portfolio to gain an
                                understanding of our project exposure and how we have kept our customers satisfied with
                                our services.</p>
                            <p>Contact us today to discuss your construction project requirements and benefit from our
                                expertise across a wide range of portfolios. Let us help you navigate the complexities
                                of construction cost estimating and consultation, ensuring the success of your
                                project.</p>
                            <p>Call us at +1 (737) 273-3314 or email us at info@constructestimates.com to discuss your
                                project needs. Alternatively, you can upload your plans to get a quote with 50% Off. We&#8217;re
                                here to provide you with reliable construction cost estimating services.From access
                                doors to panels, sliding doors to storefronts, and curtain walls to skylights, we cover
                                the full spectrum of opening requirements in the construction industry. Our
                                comprehensive estimating services extend to specialized openings, such as hangar doors,
                                coiling doors, grilles, ceiling, and smoke containment systems. Whatever your project
                                demands, we have the knowledge and resources to provide you with reliable estimates that
                                empower you to make informed decisions.</p></div>
                    </div>
                    <div class="elementor-element elementor-element-d8b7384 elementor-mobile-align-center elementor-align-left elementor-widget elementor-widget-button"
                         data-id="d8b7384" data-element_type="widget" data-widget_type="button.default">
                        <div class="elementor-widget-container">
                            <div class="elementor-button-wrapper">
                                <a class="elementor-button elementor-button-link elementor-size-sm"
                                   href="../get-a-quote/index.html">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="15" viewBox="0 0 32 15" fill="none"><circle
                            cx="7.5" cy="7.5" r="7" stroke="#0163BE"></circle><path
                            d="M31.3536 8.35355C31.5488 8.15829 31.5488 7.84171 31.3536 7.64645L28.1716 4.46447C27.9763 4.2692 27.6597 4.2692 27.4645 4.46447C27.2692 4.65973 27.2692 4.97631 27.4645 5.17157L30.2929 8L27.4645 10.8284C27.2692 11.0237 27.2692 11.3403 27.4645 11.5355C27.6597 11.7308 27.9763 11.7308 28.1716 11.5355L31.3536 8.35355ZM7 8.5H31V7.5H7V8.5Z"
                            fill="#0163BE"></path></svg>			</span>
									<span class="elementor-button-text"> Upload Plan</span>
					</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-1e98484"
                 data-id="1e98484" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-7ee86c2 elementor-invisible elementor-widget elementor-widget-image"
                         data-id="7ee86c2" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInRight&quot;}"
                         data-widget_type="image.default">
                        <div class="elementor-widget-container">
                            <img loading="lazy" decoding="async" width="558" height="506"
                                 src="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-23-1.png"
                                 class="attachment-full size-full wp-image-2933" alt="Your Success is Our Priority"
                                 srcset="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-23-1.png 558w, <?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-23-1-300x272.png 300w"
                                 sizes="(max-width: 558px) 100vw, 558px"/></div>
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

