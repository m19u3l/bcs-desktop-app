<?php
define('DS', "/");
define('DocRoot', $_SERVER['DOCUMENT_ROOT'].DS);
include DocRoot.'AdminPanel'.DS.'Includes'.DS.'Index.php';
/**
 * @var string $templatesPath
 * @var string $baseUrl
 * @var string $assetsPath
 * @var string $componentsPath
 */

$inPageCssPath = $assetsPath.'CSS'.DS.'AboutUs'.DS.'InPageCss.php';
$pageTitle = "About Us";
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
            class="elementor-section elementor-top-section elementor-element elementor-element-23cbf25 elementor-section-content-middle elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="23cbf25" data-element_type="section">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-4855705"
                 data-id="4855705" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-23d2f09 elementor-widget elementor-widget-image"
                         data-id="23d2f09" data-element_type="widget" data-widget_type="image.default">
                        <div class="elementor-widget-container">
                            <img decoding="async" width="409" height="453"
                                 src="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-10-1.png"
                                 class="attachment-full size-full wp-image-2235" alt="About Us"
                                 srcset="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-10-1.png 409w, <?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-10-1-271x300.png 271w"
                                 sizes="(max-width: 409px) 100vw, 409px"/></div>
                    </div>
                    <div class="elementor-element elementor-element-fd171d3 elementor-widget__width-initial elementor-absolute elementor-widget elementor-widget-image"
                         data-id="fd171d3" data-element_type="widget"
                         data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
                        <div class="elementor-widget-container">
                            <img decoding="async" width="306" height="374"
                                 src="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4591.png"
                                 class="attachment-full size-full wp-image-2245" alt="Constructions Plans"
                                 srcset="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4591.png 306w, <?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4591-245x300.png 245w"
                                 sizes="(max-width: 306px) 100vw, 306px"/></div>
                    </div>
                </div>
            </div>
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-85f881d"
                 data-id="85f881d" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-48f41fd elementor-widget elementor-widget-heading"
                         data-id="48f41fd" data-element_type="widget" data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Empowering
                                <span>Contractors</span> to Win Projects with <span>Confidence</span></h2></div>
                    </div>
                    <div class="elementor-element elementor-element-6220975 elementor-widget__width-inherit elementor-widget elementor-widget-text-editor"
                         data-id="6220975" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            Construct Estimates is revolutionizing the construction bidding process. As a leading
                            construction estimating firm, our mission is to make the journey from bid to project success
                            as seamless as possible for contractors and builders. With years of experience in the
                            industry and a track record of over 8000 completed projects, we have established ourselves
                            as trusted experts in accurate cost estimates and material takeoffs. Our commitment to fast
                            turnarounds, affordable prices, and exceptional quality sets us apart from the competition.
                        </div>
                    </div>
                    <div class="elementor-element elementor-element-b498213 elementor-mobile-align-justify elementor-align-left elementor-widget elementor-widget-button"
                         data-id="b498213" data-element_type="widget" data-widget_type="button.default">
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
									<span class="elementor-button-text">Start Estimating Smarter and Saving Big!</span>
					</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section
            class="elementor-section elementor-top-section elementor-element elementor-element-fdd1108 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="fdd1108" data-element_type="section"
            data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-8adb13d"
                 data-id="8adb13d" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <section
                            class="elementor-section elementor-inner-section elementor-element elementor-element-1eac76d elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                            data-id="1eac76d" data-element_type="section">
                        <div class="elementor-container elementor-column-gap-default">
                            <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-c517aea"
                                 data-id="c517aea" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-80ba68b elementor-widget__width-initial elementor-widget elementor-widget-heading"
                                         data-id="80ba68b" data-element_type="widget"
                                         data-widget_type="heading.default">
                                        <div class="elementor-widget-container">
                                            <h2 class="elementor-heading-title elementor-size-default">Our Commitment to
                                                <span>Excellence</span></h2></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section
                            class="elementor-section elementor-inner-section elementor-element elementor-element-8e4f255 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                            data-id="8e4f255" data-element_type="section">
                        <div class="elementor-container elementor-column-gap-default">
                            <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-a700591"
                                 data-id="a700591" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-92cfe57 elementor-view-default elementor-position-top elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
                                         data-id="92cfe57" data-element_type="widget"
                                         data-widget_type="icon-box.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-icon-box-wrapper">

                                                <div class="elementor-icon-box-icon">
				<span class="elementor-icon elementor-animation-">
				<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none"><circle
                            cx="15" cy="15" r="15" fill="#D5EAFE"></circle></svg>				</span>
                                                </div>

                                                <div class="elementor-icon-box-content">

                                                    <h3 class="elementor-icon-box-title">
						<span>
							Delivering Accurate Estimates for Competitive Bids						</span>
                                                    </h3>

                                                    <p class="elementor-icon-box-description">
                                                        With Construct Estimates, you can confidently bid, knowing that
                                                        your estimates are precise and competitively priced. Our team of
                                                        25 experienced estimators combines industry knowledge with the
                                                        latest tools and estimating software to provide you with
                                                        accurate cost estimations and material takeoffs. We understand
                                                        the importance of meeting deadlines without compromising on
                                                        quality or timelines, and our services empower you to deliver
                                                        projects that exceed client expectations. </p>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-753ed88"
                                 data-id="753ed88" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-cf70625 elementor-view-default elementor-position-top elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
                                         data-id="cf70625" data-element_type="widget"
                                         data-widget_type="icon-box.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-icon-box-wrapper">

                                                <div class="elementor-icon-box-icon">
				<span class="elementor-icon elementor-animation-">
				<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none"><circle
                            cx="15" cy="15" r="15" fill="#D5EAFE"></circle></svg>				</span>
                                                </div>

                                                <div class="elementor-icon-box-content">

                                                    <h3 class="elementor-icon-box-title">
						<span>
							Tailored Solutions for Diverse Construction Projects						</span>
                                                    </h3>

                                                    <p class="elementor-icon-box-description">
                                                        Whether you're involved in residential buildings, commercial
                                                        structures, civil work, or industrial projects, we offer a
                                                        comprehensive range of services catering to your needs. Our
                                                        services include construction estimating and material takeoff
                                                        services, quantity takeoffs, cost estimation, preliminary
                                                        estimates,  estimating consultant, and even colored mark-ups
                                                        with editable Excel sheets for future planning ease. We leverage
                                                        cutting-edge tools and software to ensure accuracy and
                                                        efficiency in every aspect of our work. </p>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-c6e708f"
                                 data-id="c6e708f" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-5b4a98a elementor-view-default elementor-position-top elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
                                         data-id="5b4a98a" data-element_type="widget"
                                         data-widget_type="icon-box.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-icon-box-wrapper">

                                                <div class="elementor-icon-box-icon">
				<span class="elementor-icon elementor-animation-">
				<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none"><circle
                            cx="15" cy="15" r="15" fill="#D5EAFE"></circle></svg>				</span>
                                                </div>

                                                <div class="elementor-icon-box-content">

                                                    <h3 class="elementor-icon-box-title">
						<span>
							Your Trusted Partner in Construction Estimation						</span>
                                                    </h3>

                                                    <p class="elementor-icon-box-description">
                                                        At Construct Estimates, we measure our success by the success of
                                                        our clients. With a client base of over 700 satisfied customers,
                                                        we take pride in building long-lasting relationships. We
                                                        understand the challenges you face as a contractor, and our
                                                        dedicated team is committed to providing exceptional support
                                                        throughout your projects. From personalized consultations to
                                                        ongoing assistance, we go the extra mile to ensure your
                                                        satisfaction. </p>

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
    <section
            class="elementor-section elementor-top-section elementor-element elementor-element-0d657a6 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="0d657a6" data-element_type="section">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-41c4447"
                 data-id="41c4447" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-480d820 elementor-widget__width-initial elementor-widget elementor-widget-heading"
                         data-id="480d820" data-element_type="widget" data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Why Choose <br>
                                <span>Construct Estimates?</span></h2></div>
                    </div>
                    <div class="elementor-element elementor-element-40f5469 elementor-widget elementor-widget-text-editor"
                         data-id="40f5469" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            We stand out from the competition regarding material takeoff and construction estimating
                            services. Here&#8217;s why:
                        </div>
                    </div>
                    <div class="elementor-element elementor-element-d4724bb elementor-widget elementor-widget-image"
                         data-id="d4724bb" data-element_type="widget" data-widget_type="image.default">
                        <div class="elementor-widget-container">
                            <img loading="lazy" decoding="async" width="454" height="407"
                                 src="<?php echo $assetsUrl;?>uploads/2023/08/Group-238069-1.svg"
                                 class="attachment-full size-full wp-image-2280" alt="Why Choose"/></div>
                    </div>
                </div>
            </div>
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-949cd60"
                 data-id="949cd60" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-b7f887e elementor-widget elementor-widget-accordion"
                         data-id="b7f887e" data-element_type="widget" data-widget_type="accordion.default">
                        <div class="elementor-widget-container">
                            <div class="elementor-accordion">
                                <div class="elementor-accordion-item">
                                    <h3 id="elementor-tab-title-1921" class="elementor-tab-title" data-tab="1"
                                        role="button" aria-controls="elementor-tab-content-1921" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-right"
                                                          aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg
                                                                        class="e-font-icon-svg e-fas-chevron-down"
                                                                        viewBox="0 0 448 512"
                                                                        xmlns="http://www.w3.org/2000/svg"><path
                                                                            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg
                                            class="e-font-icon-svg e-fas-chevron-up" viewBox="0 0 448 512"
                                            xmlns="http://www.w3.org/2000/svg"><path
                                                d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg></span>
														</span>
                                        <a class="elementor-accordion-title" tabindex="0">Trust in Accurate
                                            Estimates</a>
                                    </h3>
                                    <div id="elementor-tab-content-1921"
                                         class="elementor-tab-content elementor-clearfix" data-tab="1" role="region"
                                         aria-labelledby="elementor-tab-title-1921"><p>At Construct Estimates, we
                                            deliver precise and dependable construction cost estimates. Our meticulous
                                            analysis and attention to detail ensure accurate projections, mitigating the
                                            risk of unexpected expenses and delays. Trust us for reliable estimates that
                                            provide a solid foundation for successful project planning and execution.</p>
                                    </div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <h3 id="elementor-tab-title-1922" class="elementor-tab-title" data-tab="2"
                                        role="button" aria-controls="elementor-tab-content-1922" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-right"
                                                          aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg
                                                                        class="e-font-icon-svg e-fas-chevron-down"
                                                                        viewBox="0 0 448 512"
                                                                        xmlns="http://www.w3.org/2000/svg"><path
                                                                            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg
                                            class="e-font-icon-svg e-fas-chevron-up" viewBox="0 0 448 512"
                                            xmlns="http://www.w3.org/2000/svg"><path
                                                d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg></span>
														</span>
                                        <a class="elementor-accordion-title" tabindex="0">Save Time and Money</a>
                                    </h3>
                                    <div id="elementor-tab-content-1922"
                                         class="elementor-tab-content elementor-clearfix" data-tab="2" role="region"
                                         aria-labelledby="elementor-tab-title-1922"><p>Outsourcing your estimating needs
                                            to us saves you valuable time and <b>reduces overhead costs by up to 50%</b>.
                                            Our experienced team of construction price estimators, combined with
                                            cutting-edge software, guarantees <b>fast turnaround times (24 to 48 hours)</b>
                                            without compromising accuracy. Maximize efficiency and cost-effectiveness by
                                            relying on our expertise.</p></div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <h3 id="elementor-tab-title-1923" class="elementor-tab-title" data-tab="3"
                                        role="button" aria-controls="elementor-tab-content-1923" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-right"
                                                          aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg
                                                                        class="e-font-icon-svg e-fas-chevron-down"
                                                                        viewBox="0 0 448 512"
                                                                        xmlns="http://www.w3.org/2000/svg"><path
                                                                            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg
                                            class="e-font-icon-svg e-fas-chevron-up" viewBox="0 0 448 512"
                                            xmlns="http://www.w3.org/2000/svg"><path
                                                d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg></span>
														</span>
                                        <a class="elementor-accordion-title" tabindex="0">Certified Estimators</a>
                                    </h3>
                                    <div id="elementor-tab-content-1923"
                                         class="elementor-tab-content elementor-clearfix" data-tab="3" role="region"
                                         aria-labelledby="elementor-tab-title-1923">Our certified construction
                                        estimators possess industry-leading qualifications and expertise. Collaborating
                                        closely with construction managers, quantity surveyors, architects, and
                                        contractors, our team ensures that our estimates adhere to the highest industry
                                        standards. With our certified professionals, you can trust in the accuracy and
                                        reliability of our estimates.
                                    </div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <h3 id="elementor-tab-title-1924" class="elementor-tab-title" data-tab="4"
                                        role="button" aria-controls="elementor-tab-content-1924" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-right"
                                                          aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg
                                                                        class="e-font-icon-svg e-fas-chevron-down"
                                                                        viewBox="0 0 448 512"
                                                                        xmlns="http://www.w3.org/2000/svg"><path
                                                                            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg
                                            class="e-font-icon-svg e-fas-chevron-up" viewBox="0 0 448 512"
                                            xmlns="http://www.w3.org/2000/svg"><path
                                                d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg></span>
														</span>
                                        <a class="elementor-accordion-title" tabindex="0">Meet Your Deadlines</a>
                                    </h3>
                                    <div id="elementor-tab-content-1924"
                                         class="elementor-tab-content elementor-clearfix" data-tab="4" role="region"
                                         aria-labelledby="elementor-tab-title-1924"><p>Count on us to meet your project
                                            deadlines. Our streamlined processes and dedicated team enable us to complete
                                            projects within agreed-upon timeframes, empowering you to make informed
                                            decisions and keep your projects on track. Rest easy knowing that our reliable
                                            estimates will help you meet your project milestones and deliver on time.</p>
                                    </div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <h3 id="elementor-tab-title-1925" class="elementor-tab-title" data-tab="5"
                                        role="button" aria-controls="elementor-tab-content-1925" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-right"
                                                          aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg
                                                                        class="e-font-icon-svg e-fas-chevron-down"
                                                                        viewBox="0 0 448 512"
                                                                        xmlns="http://www.w3.org/2000/svg"><path
                                                                            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg
                                            class="e-font-icon-svg e-fas-chevron-up" viewBox="0 0 448 512"
                                            xmlns="http://www.w3.org/2000/svg"><path
                                                d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg></span>
														</span>
                                        <a class="elementor-accordion-title" tabindex="0">Competitive Pricing</a>
                                    </h3>
                                    <div id="elementor-tab-content-1925"
                                         class="elementor-tab-content elementor-clearfix" data-tab="5" role="region"
                                         aria-labelledby="elementor-tab-title-1925"><p>Our competitive market prices
                                            make our estimates and takeoffs accessible to many clients. We offer our
                                            services at affordable rates, tailored to fit your project&#8217;s scope and
                                            budget. While the <b>average cost of our services is $200</b>, our goal is to
                                            provide exceptional value for your investment. Benefit from accurate estimates
                                            without breaking the bank.</p></div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <h3 id="elementor-tab-title-1926" class="elementor-tab-title" data-tab="6"
                                        role="button" aria-controls="elementor-tab-content-1926" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-right"
                                                          aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg
                                                                        class="e-font-icon-svg e-fas-chevron-down"
                                                                        viewBox="0 0 448 512"
                                                                        xmlns="http://www.w3.org/2000/svg"><path
                                                                            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg
                                            class="e-font-icon-svg e-fas-chevron-up" viewBox="0 0 448 512"
                                            xmlns="http://www.w3.org/2000/svg"><path
                                                d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg></span>
														</span>
                                        <a class="elementor-accordion-title" tabindex="0">Customized Solutions</a>
                                    </h3>
                                    <div id="elementor-tab-content-1926"
                                         class="elementor-tab-content elementor-clearfix" data-tab="6" role="region"
                                         aria-labelledby="elementor-tab-title-1926"><p>We recognize that every
                                            construction project is unique. Our team takes the time to understand your
                                            specific requirements, tailoring our estimates to meet your needs precisely.
                                            With a collaborative approach, we provide personalized solutions that align with
                                            your goals, budget, and timeline. Experience the difference of customized
                                            estimates crafted just for you.</p></div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <h3 id="elementor-tab-title-1927" class="elementor-tab-title" data-tab="7"
                                        role="button" aria-controls="elementor-tab-content-1927" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-right"
                                                          aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg
                                                                        class="e-font-icon-svg e-fas-chevron-down"
                                                                        viewBox="0 0 448 512"
                                                                        xmlns="http://www.w3.org/2000/svg"><path
                                                                            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg
                                            class="e-font-icon-svg e-fas-chevron-up" viewBox="0 0 448 512"
                                            xmlns="http://www.w3.org/2000/svg"><path
                                                d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg></span>
														</span>
                                        <a class="elementor-accordion-title" tabindex="0">Exceptional Customer
                                            Support</a>
                                    </h3>
                                    <div id="elementor-tab-content-1927"
                                         class="elementor-tab-content elementor-clearfix" data-tab="7" role="region"
                                         aria-labelledby="elementor-tab-title-1927"><p>Your satisfaction is our top
                                            priority. Our dedicated support team is available <b>24/7</b> to address any
                                            questions or concerns you may have. We are committed to guiding you through the
                                            construction cost estimating process, helping you win bids, generate more leads,
                                            and providing unparalleled customer support. Trust us to be your reliable
                                            partner in construction estimation.</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section
            class="elementor-section elementor-top-section elementor-element elementor-element-077ac74 elementor-section-content-middle elementor-reverse-mobile elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="077ac74" data-element_type="section"
            data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-6bce303"
                 data-id="6bce303" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-dca2607 elementor-widget elementor-widget-heading"
                         data-id="dca2607" data-element_type="widget" data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Experience Our Of <span>Global Network </span>
                                of <span>Global Network </span></h2></div>
                    </div>
                    <div class="elementor-element elementor-element-5ba9f3a elementor-widget__width-inherit elementor-widget elementor-widget-text-editor"
                         data-id="5ba9f3a" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            <p>Working with Construct Estimates means tapping into our global network of construction
                                cost experts. We invite you to reach out to us for any inquiries or to get started on
                                your construction cost estimating and consultation needs. <strong><a
                                            href="tel:17372733314">Contact us at +1 (737) 273-3314</a> </strong> to speak
                                with our friendly team, or email us at <a
                                        href="mailto:info@constructestimates.com"><strong>info@constructestimates.com</strong></a>.
                                Alternatively, you can conveniently upload your plans through our website to receive a
                                quote with 50% Off.</p></div>
                    </div>
                    <div class="elementor-element elementor-element-e234d4c elementor-mobile-align-center elementor-align-left elementor-widget elementor-widget-button"
                         data-id="e234d4c" data-element_type="widget" data-widget_type="button.default">
                        <div class="elementor-widget-container">
                            <div class="elementor-button-wrapper">
                                <a class="elementor-button elementor-button-link elementor-size-sm"
                                   href="../contact-us/index.html">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="15" viewBox="0 0 32 15" fill="none"><circle
                            cx="7.5" cy="7.5" r="7" stroke="#0163BE"></circle><path
                            d="M31.3536 8.35355C31.5488 8.15829 31.5488 7.84171 31.3536 7.64645L28.1716 4.46447C27.9763 4.2692 27.6597 4.2692 27.4645 4.46447C27.2692 4.65973 27.2692 4.97631 27.4645 5.17157L30.2929 8L27.4645 10.8284C27.2692 11.0237 27.2692 11.3403 27.4645 11.5355C27.6597 11.7308 27.9763 11.7308 28.1716 11.5355L31.3536 8.35355ZM7 8.5H31V7.5H7V8.5Z"
                            fill="#0163BE"></path></svg>			</span>
									<span class="elementor-button-text">Upload Plans Here</span>
					</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-5199f64"
                 data-id="5199f64" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-c391e35 elementor-widget elementor-widget-image"
                         data-id="c391e35" data-element_type="widget" data-widget_type="image.default">
                        <div class="elementor-widget-container">
                            <img loading="lazy" decoding="async" width="410" height="452"
                                 src="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-11-1.png"
                                 class="attachment-full size-full wp-image-2314"
                                 alt="Experience Our Of xGlobal Network of Global Network"
                                 srcset="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-11-1.png 410w, <?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-11-1-272x300.png 272w"
                                 sizes="(max-width: 410px) 100vw, 410px"/></div>
                    </div>
                    <div class="elementor-element elementor-element-0ee04ef elementor-widget__width-initial elementor-widget-tablet__width-initial elementor-absolute elementor-widget elementor-widget-image"
                         data-id="0ee04ef" data-element_type="widget"
                         data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
                        <div class="elementor-widget-container">
                            <img loading="lazy" decoding="async" width="307" height="373"
                                 src="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4591-1.png"
                                 class="attachment-full size-full wp-image-2315"
                                 alt="Experience Our Of xGlobal Network of Global Network"
                                 srcset="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4591-1.png 307w, <?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4591-1-247x300.png 247w"
                                 sizes="(max-width: 307px) 100vw, 307px"/></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>


<?php
$mainContent = ob_get_clean();
require_once $templatesPath.'InnerPage.php';
?>

