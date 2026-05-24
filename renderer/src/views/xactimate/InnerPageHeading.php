<?php
/**
 * @var string $baseUrl
 */

$pageTitle = isset($pageTitle) ? $pageTitle : "Page Title";

$defaultBreadcrumb = [
    ['title' => 'Home', 'link' => $baseUrl],
    ['title' => $pageTitle, 'link' => ''],
];

$breadcrumbs = isset($breadcrumbs) ? $breadcrumbs : $defaultBreadcrumb;
?>
<section
        class="elementor-section elementor-top-section elementor-element elementor-element-3d20e07 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
        data-id="3d20e07" data-element_type="section"
        data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
    <div class="elementor-container elementor-column-gap-default">
        <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-6eb2a64"
             data-id="6eb2a64" data-element_type="column">
            <div class="elementor-widget-wrap elementor-element-populated">
                <div class="elementor-element elementor-element-cb08247 elementor-widget elementor-widget-heading"
                     data-id="cb08247" data-element_type="widget" data-widget_type="heading.default">
                    <div class="elementor-widget-container">
                        <h1 class="elementor-heading-title elementor-size-default"><?php echo $pageTitle ?></h1></div>
                </div>
                <div class="elementor-element elementor-element-5578dd2 elementor-align-center elementor-widget elementor-widget-breadcrumbs"
                     data-id="5578dd2" data-element_type="widget" data-widget_type="breadcrumbs.default">
                    <div class="elementor-widget-container">
                        <p id="breadcrumbs">
                            <span>
                                <?php
                                foreach ($breadcrumbs as $breadcrumbIn) {
                                    $link = isset($breadcrumbIn['link']) ? $breadcrumbIn['link'] : '';
                                    $title = isset($breadcrumbIn['title']) ? $breadcrumbIn['title'] : '';
                                    echo ($link != '') ? "<span><a href='$link'>$title</a> » </span>" : "<span class='breadcrumb_last' aria-current='page'>$title</span>";
                                } ?>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>