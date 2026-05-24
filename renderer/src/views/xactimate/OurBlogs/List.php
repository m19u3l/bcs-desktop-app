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

$inPageCssPath = $assetsPath . 'CSS'.DS.'OurBlogs'.DS.'InPageCss.php';
$pageTitle = "Our Blogs";
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
            class="elementor-section elementor-top-section elementor-element elementor-element-36fd1ed elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="36fd1ed" data-element_type="section">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-864cb3e"
                 data-id="864cb3e" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-b368464 elementor-grid-3 elementor-grid-tablet-2 elementor-grid-mobile-1 elementor-posts--thumbnail-top elementor-invisible elementor-widget elementor-widget-posts"
                         data-id="b368464" data-element_type="widget"
                         data-settings="{&quot;classic_row_gap&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:19,&quot;sizes&quot;:[]},&quot;pagination_type&quot;:&quot;numbers_and_prev_next&quot;,&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;classic_columns&quot;:&quot;3&quot;,&quot;classic_columns_tablet&quot;:&quot;2&quot;,&quot;classic_columns_mobile&quot;:&quot;1&quot;,&quot;classic_row_gap_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;classic_row_gap_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]}}"
                         data-widget_type="posts.classic">
                        <div class="elementor-widget-container">
                            <div class="elementor-posts-container elementor-posts elementor-posts--skin-classic elementor-grid">
                                <article
                                        class="elementor-post elementor-grid-item post-9099 post type-post status-publish format-standard has-post-thumbnail hentry category-cost-estimation-takeoffs">
                                    <a class="elementor-post__thumbnail__link"
                                       href="/our-blogs/what-is-a-soft-cost-in-construction" tabindex="-1">
                                        <div class="elementor-post__thumbnail"><img decoding="async" width="1000"
                                                                                    height="660"
                                                                                    src="<?php echo $assetsUrl; ?>uploads/2025/01/cost.jpg"
                                                                                    class="attachment-full size-full wp-image-9113"
                                                                                    alt="What is a soft cost in construction?"
                                                                                    srcset="<?php echo $assetsUrl; ?>uploads/2025/01/cost.jpg 1000w, <?php echo $assetsUrl; ?>uploads/2025/01/cost-300x198.jpg 300w, <?php echo $assetsUrl; ?>uploads/2025/01/cost-768x507.jpg 768w"
                                                                                    sizes="(max-width: 1000px) 100vw, 1000px"/>
                                        </div>
                                    </a>
                                    <div class="elementor-post__text">
                                        <h3 class="elementor-post__title">
                                            <a href="/our-blogs/what-is-a-soft-cost-in-construction">
                                                What is a Soft Cost in Construction and Why It Matters? </a>
                                        </h3>
                                        <div class="elementor-post__meta-data">
					<span class="elementor-post-date">
			January 2, 2025		</span>
                                        </div>
                                        <div class="elementor-post__excerpt">
                                            <p>When you think of building a house, a school, or even a shopping mall,
                                                you include the workers, machines, and materials that bring the
                                                project</p>
                                        </div>

                                        <a class="elementor-post__read-more"
                                           href="/our-blogs/what-is-a-soft-cost-in-construction"
                                           aria-label="Read more about What is a Soft Cost in Construction and Why It Matters?"
                                           tabindex="-1">
                                            Read More </a>

                                    </div>
                                </article>
                                <article
                                        class="elementor-post elementor-grid-item post-9023 post type-post status-publish format-standard has-post-thumbnail hentry category-sustainable-advanced-construction">
                                    <a class="elementor-post__thumbnail__link"
                                       href="/our-blogs/what-is-a-soft-cost-in-construction" tabindex="-1">
                                        <div class="elementor-post__thumbnail"><img loading="lazy" decoding="async"
                                                                                    width="1000" height="660"
                                                                                    src="<?php echo $assetsUrl; ?>uploads/2024/12/sitework.jpg"
                                                                                    class="attachment-full size-full wp-image-9044"
                                                                                    alt="What is sitework in construction?"
                                                                                    srcset="<?php echo $assetsUrl; ?>uploads/2024/12/sitework.jpg 1000w, <?php echo $assetsUrl; ?>uploads/2024/12/sitework-300x198.jpg 300w, <?php echo $assetsUrl; ?>uploads/2024/12/sitework-768x507.jpg 768w"
                                                                                    sizes="(max-width: 1000px) 100vw, 1000px"/>
                                        </div>
                                    </a>
                                    <div class="elementor-post__text">
                                        <h3 class="elementor-post__title">
                                            <a href="/our-blogs/what-is-a-soft-cost-in-construction">
                                                What is Sitework in Construction? Everything You Need to Know </a>
                                        </h3>
                                        <div class="elementor-post__meta-data">
					<span class="elementor-post-date">
			December 24, 2024		</span>
                                        </div>
                                        <div class="elementor-post__excerpt">
                                            <p>Before any building rises from the ground, there&#8217;s a lot of work
                                                that needs to happen to prepare the land. This essential phase is
                                                called</p>
                                        </div>

                                        <a class="elementor-post__read-more"
                                           href="/our-blogs/what-is-a-soft-cost-in-construction"
                                           aria-label="Read more about What is Sitework in Construction? Everything You Need to Know"
                                           tabindex="-1">
                                            Read More </a>

                                    </div>
                                </article>
                            </div>

                            <!--<div class="e-load-more-anchor" data-page="1" data-max-page="10"
                                 data-next-page="/our-blogs/2/"></div>
                            <nav class="elementor-pagination" aria-label="Pagination">
                                <span class="page-numbers prev">&#8249; Previous</span>
                                <span aria-current="page" class="page-numbers current"><span
                                            class="elementor-screen-only">Page</span>1</span>
                                <a class="page-numbers" href="2/index.html"><span
                                            class="elementor-screen-only">Page</span>2</a>
                                <a class="page-numbers" href="3/index.html"><span
                                            class="elementor-screen-only">Page</span>3</a>
                                <span class="page-numbers dots">&hellip;</span>
                                <a class="page-numbers" href="10/index.html"><span
                                            class="elementor-screen-only">Page</span>10</a>
                                <a class="page-numbers next" href="2/index.html">Next &#8250;</a></nav>-->
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

