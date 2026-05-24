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

$inPageCssPath = $assetsPath . 'CSS'.DS.'Testimonials'.DS.'InPageCss.php';
$pageTitle = "Testimonials";
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
            class="elementor-section elementor-top-section elementor-element elementor-element-d350ce1 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="d350ce1" data-element_type="section"
            data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-4d0cc81"
                 data-id="4d0cc81" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-557b7eb elementor-invisible elementor-widget elementor-widget-heading"
                         data-id="557b7eb" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInDown&quot;}"
                         data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">What Our Clients Say About
                                Us</h2></div>
                    </div>
                    <section
                            class="elementor-section elementor-inner-section elementor-element elementor-element-9d25857 elementor-section-content-middle elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                            data-id="9d25857" data-element_type="section">
                        <div class="elementor-container elementor-column-gap-default">
                            <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-5aaab20"
                                 data-id="5aaab20" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-ec64c85 elementor-widget elementor-widget-testimonial"
                                         data-id="ec64c85" data-element_type="widget"
                                         data-widget_type="testimonial.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-testimonial-wrapper">
                                                <div class="elementor-testimonial-content">They deliver more than they
                                                    promise and they have well-trained professional staff.
                                                </div>

                                                <div class="elementor-testimonial-meta elementor-has-image elementor-testimonial-image-position-aside">
                                                    <div class="elementor-testimonial-meta-inner">
                                                        <div class="elementor-testimonial-image">
                                                            <img decoding="async" width="96" height="96"
                                                                 src="<?php echo $assetsUrl; ?>uploads/2023/08/5b8b55d917b8a236075da7303fb03948.jpg"
                                                                 class="attachment-full size-full wp-image-2950"
                                                                 alt="Testimonial Avatar"/></div>

                                                        <div class="elementor-testimonial-details">
                                                            <div class="elementor-testimonial-name">James Builders</div>
                                                            <div class="elementor-testimonial-job">Contractor</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="elementor-element elementor-element-74458b8 elementor-widget elementor-widget-testimonial"
                                         data-id="74458b8" data-element_type="widget"
                                         data-widget_type="testimonial.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-testimonial-wrapper">
                                                <div class="elementor-testimonial-content">These guys were very
                                                    attentive to my specific, custom needs for estimating and delivered
                                                    an excellent product in very timely fashion. I'm looking forward to
                                                    hiring them again in the near future!
                                                </div>

                                                <div class="elementor-testimonial-meta elementor-has-image elementor-testimonial-image-position-aside">
                                                    <div class="elementor-testimonial-meta-inner">
                                                        <div class="elementor-testimonial-image">
                                                            <img decoding="async" width="96" height="96"
                                                                 src="<?php echo $assetsUrl; ?>uploads/2023/08/5b8b55d917b8a236075da7303fb03948.jpg"
                                                                 class="attachment-full size-full wp-image-2950"
                                                                 alt="Testimonial Avatar"/></div>

                                                        <div class="elementor-testimonial-details">
                                                            <div class="elementor-testimonial-name">Bill A.</div>
                                                            <div class="elementor-testimonial-job">Contractor</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="elementor-element elementor-element-1f20bf0 elementor-widget elementor-widget-testimonial"
                                         data-id="1f20bf0" data-element_type="widget"
                                         data-widget_type="testimonial.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-testimonial-wrapper">
                                                <div class="elementor-testimonial-content">excellent service all round,
                                                    fast informative and very professional.
                                                </div>

                                                <div class="elementor-testimonial-meta elementor-has-image elementor-testimonial-image-position-aside">
                                                    <div class="elementor-testimonial-meta-inner">
                                                        <div class="elementor-testimonial-image">
                                                            <img decoding="async" width="96" height="96"
                                                                 src="<?php echo $assetsUrl; ?>uploads/2023/08/5b8b55d917b8a236075da7303fb03948.jpg"
                                                                 class="attachment-full size-full wp-image-2950"
                                                                 alt="Testimonial Avatar"/></div>

                                                        <div class="elementor-testimonial-details">
                                                            <div class="elementor-testimonial-name">Alan Stuckey</div>
                                                            <div class="elementor-testimonial-job">Contractor</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-e38b431"
                                 data-id="e38b431" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-d423045 elementor-widget elementor-widget-testimonial"
                                         data-id="d423045" data-element_type="widget"
                                         data-widget_type="testimonial.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-testimonial-wrapper">
                                                <div class="elementor-testimonial-content">Their Head Estimator took
                                                    direction well, met the deadline alongside their team, and their
                                                    skills are strong. Their communication was great and I will most
                                                    likely be reaching out to them for help on future projects.
                                                </div>

                                                <div class="elementor-testimonial-meta elementor-has-image elementor-testimonial-image-position-aside">
                                                    <div class="elementor-testimonial-meta-inner">
                                                        <div class="elementor-testimonial-image">
                                                            <img decoding="async" width="96" height="96"
                                                                 src="<?php echo $assetsUrl; ?>uploads/2023/08/5b8b55d917b8a236075da7303fb03948.jpg"
                                                                 class="attachment-full size-full wp-image-2950"
                                                                 alt="Testimonial Avatar"/></div>

                                                        <div class="elementor-testimonial-details">
                                                            <div class="elementor-testimonial-name">Caryn Viscovi</div>
                                                            <div class="elementor-testimonial-job">Contractor</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="elementor-element elementor-element-1919505 elementor-widget elementor-widget-testimonial"
                                         data-id="1919505" data-element_type="widget"
                                         data-widget_type="testimonial.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-testimonial-wrapper">
                                                <div class="elementor-testimonial-content">Construct Estimates is an
                                                    exceptional asset to our projects. Despite the rush on some
                                                    projects, CE demonstrated remarkable dedication, successfully
                                                    meeting the deadlines without compromising the quality of their
                                                    output. Based on this positive experience, I have no doubt that I
                                                    will seek opportunities to collaborate with CE again in the future.
                                                    Their expertise and reliability make them an invaluable team members
                                                    for any project.
                                                </div>

                                                <div class="elementor-testimonial-meta elementor-has-image elementor-testimonial-image-position-aside">
                                                    <div class="elementor-testimonial-meta-inner">
                                                        <div class="elementor-testimonial-image">
                                                            <img decoding="async" width="96" height="96"
                                                                 src="<?php echo $assetsUrl; ?>uploads/2023/08/5b8b55d917b8a236075da7303fb03948.jpg"
                                                                 class="attachment-full size-full wp-image-2950"
                                                                 alt="Testimonial Avatar"/></div>

                                                        <div class="elementor-testimonial-details">
                                                            <div class="elementor-testimonial-name">Allison Dorwart
                                                            </div>
                                                            <div class="elementor-testimonial-job">Contractor</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="elementor-element elementor-element-0949778 elementor-widget elementor-widget-testimonial"
                                         data-id="0949778" data-element_type="widget"
                                         data-widget_type="testimonial.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-testimonial-wrapper">
                                                <div class="elementor-testimonial-content"> I am very impressed with
                                                    their ability to understand, interpret and implement the
                                                    requirements i had for my project. Very quick service and great
                                                    communication
                                                    I will invite Construct Estimates to work for me again 🙂
                                                </div>

                                                <div class="elementor-testimonial-meta elementor-has-image elementor-testimonial-image-position-aside">
                                                    <div class="elementor-testimonial-meta-inner">
                                                        <div class="elementor-testimonial-image">
                                                            <img decoding="async" width="96" height="96"
                                                                 src="<?php echo $assetsUrl; ?>uploads/2023/08/5b8b55d917b8a236075da7303fb03948.jpg"
                                                                 class="attachment-full size-full wp-image-2950"
                                                                 alt="Testimonial Avatar"/></div>

                                                        <div class="elementor-testimonial-details">
                                                            <div class="elementor-testimonial-name"> Mark Scheinberg
                                                            </div>
                                                            <div class="elementor-testimonial-job">Contractor</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-9eb9371"
                                 data-id="9eb9371" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-ee6422f elementor-widget elementor-widget-testimonial"
                                         data-id="ee6422f" data-element_type="widget"
                                         data-widget_type="testimonial.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-testimonial-wrapper">
                                                <div class="elementor-testimonial-content">Good afternoon. This is Dawn
                                                    from LA Plumbing & A/C from San Antonio, Texas. I would like to tell
                                                    you how wonderful Scott Adkins and the rest of the team are at
                                                    Construct Estimates. They have been doing my estimates for at least
                                                    2 years now and I have no complaints. I have on the project board at
                                                    this moment over 3 million dollars of projects that they have
                                                    estimated for me. The projects consist of The MAC center (hospital
                                                    for children), 7 Pizza Huts, YardBirds, The MassageLux, 4 Crunch
                                                    Fitness Facilities, 7 Dunkins and The Good Shepherd Church of
                                                    Christ. I will not use any other estimation service because this
                                                    team has been real good to me.
                                                </div>

                                                <div class="elementor-testimonial-meta elementor-has-image elementor-testimonial-image-position-aside">
                                                    <div class="elementor-testimonial-meta-inner">
                                                        <div class="elementor-testimonial-image">
                                                            <img decoding="async" width="96" height="96"
                                                                 src="<?php echo $assetsUrl; ?>uploads/2023/08/5b8b55d917b8a236075da7303fb03948.jpg"
                                                                 class="attachment-full size-full wp-image-2950"
                                                                 alt="Testimonial Avatar"/></div>

                                                        <div class="elementor-testimonial-details">
                                                            <div class="elementor-testimonial-name">Alain Bouchard</div>
                                                            <div class="elementor-testimonial-job">Contractor</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="elementor-element elementor-element-5171b64 elementor-widget elementor-widget-testimonial"
                                         data-id="5171b64" data-element_type="widget"
                                         data-widget_type="testimonial.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-testimonial-wrapper">
                                                <div class="elementor-testimonial-content">Construct Estimates provide
                                                    accurate measurements with fast project delivery. Highly recommend.
                                                </div>

                                                <div class="elementor-testimonial-meta elementor-has-image elementor-testimonial-image-position-aside">
                                                    <div class="elementor-testimonial-meta-inner">
                                                        <div class="elementor-testimonial-image">
                                                            <img decoding="async" width="96" height="96"
                                                                 src="<?php echo $assetsUrl; ?>uploads/2023/08/5b8b55d917b8a236075da7303fb03948.jpg"
                                                                 class="attachment-full size-full wp-image-2950"
                                                                 alt="Testimonial Avatar"/></div>

                                                        <div class="elementor-testimonial-details">
                                                            <div class="elementor-testimonial-name">Alex James</div>
                                                            <div class="elementor-testimonial-job">Contractor</div>
                                                        </div>
                                                    </div>
                                                </div>
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
</div>


<?php
$mainContent = ob_get_clean();
require_once $templatesPath . 'InnerPage.php';
?>

