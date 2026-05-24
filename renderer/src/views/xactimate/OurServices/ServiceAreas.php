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

$inPageCssPath = $assetsPath . 'CSS'.DS.'OurServices'.DS.'InPageCss.php';
$pageTitle = "Our Service Areas";
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
            class="elementor-section elementor-top-section elementor-element elementor-element-4c76573 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
            data-id="4c76573" data-element_type="section">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-29ff8ac"
                 data-id="29ff8ac" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <div class="elementor-element elementor-element-575ab1a elementor-invisible elementor-widget elementor-widget-image"
                         data-id="575ab1a" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;}" data-widget_type="image.default">
                        <div class="elementor-widget-container">
                            <img decoding="async" width="558" height="538"
                                 src="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-17-1-1.png"
                                 class="attachment-full size-full wp-image-3460" alt="Concrete Estimating Services"
                                 srcset="<?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-17-1-1.png 558w, <?php echo $assetsUrl;?>uploads/2023/08/Rectangle-4488-17-1-1-300x289.png 300w"
                                 sizes="(max-width: 558px) 100vw, 558px"/></div>
                    </div>
                    <div class="elementor-element elementor-element-6dcd090 elementor-invisible elementor-widget elementor-widget-heading"
                         data-id="6dcd090" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInLeft&quot;}"
                         data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Professional Concrete Estimating
                                Services for<span> Accurate Project Estimates</span></h2></div>
                    </div>
                    <div class="elementor-element elementor-element-c1451c2 elementor-widget__width-inherit elementor-widget elementor-widget-text-editor"
                         data-id="c1451c2" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            <p>With years of experience serving general contracting corporations, concrete contractors,
                                home builders, and real estate developers, Construct Estimates has become a trusted name
                                in the industry. Our expert team specializes in <strong>Division 3 trades</strong>. It
                                is certified by esteemed organizations like the American Association of Cost Engineers
                                <strong>(AACE)</strong> and the Australian Institute of Quantity Surveyors <strong>(AIQS)</strong>.
                                When you partner with us, you can rest assured that your concrete estimating needs are
                                in capable hands.</p>
                            <p>At Construct Estimates, we go the extra mile to deliver a service that exceeds your
                                expectations. Our team understands the unique demands of your industry, from <strong>sidewalks
                                    and driveways to intricate paving projects</strong>. We pride ourselves on staying
                                up-to-date with industry trends and techniques, ensuring our estimates are always ahead
                                of the curve.</p>
                            <p><strong>Building Success with Precise Concrete Estimates.</strong></p></div>
                    </div>
                    <div class="elementor-element elementor-element-5696c48 elementor-mobile-align-center elementor-align-left elementor-widget elementor-widget-button"
                         data-id="5696c48" data-element_type="widget" data-widget_type="button.default">
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
									<span class="elementor-button-text">Get an Estimate Today!</span>
					</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="elementor-element elementor-element-0172743 elementor-invisible elementor-widget elementor-widget-heading"
                         data-id="0172743" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInLeft&quot;}"
                         data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Expert Concrete Estimators for
                                Precise Cost Estimation and <span>Material Takeoffs</span></h2></div>
                    </div>
                    <div class="elementor-element elementor-element-da66b93 elementor-widget elementor-widget-text-editor"
                         data-id="da66b93" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            <p>At Construct Estimates, we understand the critical role accurate cost estimation plays in
                                the success of your construction projects. Our team of expert concrete estimators
                                combines industry knowledge, cutting-edge software, and thorough attention to detail to
                                provide you with precise cost estimates and material takeoffs.</p>
                            <p>Whether you&#8217;re working on <strong>residential, commercial, or industrial
                                    projects</strong>, our estimators have the expertise to deliver reliable results.</p>
                        </div>
                    </div>
                    <div class="elementor-element elementor-element-b32ee92 elementor-invisible elementor-widget elementor-widget-heading"
                         data-id="b32ee92" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInLeft&quot;}"
                         data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h3 class="elementor-heading-title elementor-size-default">Are you Tired of Inaccurate
                                <span>Concrete Estimates? </span> Look no further.</h3></div>
                    </div>
                    <div class="elementor-element elementor-element-323fe48 elementor-widget-mobile__width-inherit elementor-widget elementor-widget-text-editor"
                         data-id="323fe48" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            <p>Say goodbye to the frustration of inaccurate concrete estimates. Construct Estimates is
                                dedicated to ensuring that you receive the most accurate and detailed estimates for your
                                projects. <br/><br/>Even a tiny miscalculation can significantly impact your budget and
                                project timeline. That&#8217;s why we employ a rigorous quality control process to
                                verify the accuracy of our estimates, giving you the confidence to make informed
                                decisions and avoid costly surprises.</p></div>
                    </div>
                    <div class="elementor-element elementor-element-ad5090c elementor-invisible elementor-widget elementor-widget-heading"
                         data-id="ad5090c" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInLeft&quot;}"
                         data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h3 class="elementor-heading-title elementor-size-default">How We Help You <span>Win Projects</span>?
                            </h3></div>
                    </div>
                    <div class="elementor-element elementor-element-9d1409e elementor-widget__width-inherit elementor-widget elementor-widget-text-editor"
                         data-id="9d1409e" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            <p>In today&#8217;s competitive construction industry, winning projects often comes down to
                                providing accurate and competitive cost estimates. Construct Estimates is committed to
                                helping you secure more projects by providing comprehensive concrete estimating
                                services. Our team leverages advanced software tools and industry expertise to deliver
                                estimates that are not only accurate but also competitive. With our assistance, you can
                                impress clients, demonstrate professionalism, and gain a competitive edge.</p>
                            <p><strong>Win More Bids, Win More Projects</strong></p></div>
                    </div>
                    <div class="elementor-element elementor-element-e90625b elementor-mobile-align-justify elementor-align-left elementor-widget elementor-widget-button"
                         data-id="e90625b" data-element_type="widget" data-widget_type="button.default">
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
									<span class="elementor-button-text">Partner with Construct Estimates!</span>
					</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="elementor-element elementor-element-7f64d46 elementor-invisible elementor-widget elementor-widget-heading"
                         data-id="7f64d46" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInLeft&quot;}"
                         data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Our <span> Comprehensive  </span>Concrete
                                Estimation Services</h2></div>
                    </div>
                    <div class="elementor-element elementor-element-fd0f437 elementor-widget elementor-widget-text-editor"
                         data-id="fd0f437" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            <ul>
                                <li>Material Takeoffs</li>
                                <li>Detailed Cost Estimates</li>
                                <li>Bid Preparation and Proposals</li>
                                <li>Concrete Quantity Takeoffs</li>
                                <li>Budget &amp; Bid Estimates</li>
                                <li>Design Estimates</li>
                                <li>Change Order Estimates</li>
                                <li>Value Engineering</li>
                                <li>Project Lead Generation</li>
                                <li>Concrete Contractor Marketing</li>
                                <li>Expert Witness and Litigation Assistance</li>
                                <li>Concrete takeoff spreadsheets</li>
                                <li>Material, labor &amp; equipment costs</li>
                                <li>Man Hours</li>
                                <li>Marked-up drawing plans</li>
                                <li>Takeoff summary including total costs for material, labor, equipment, overhead,
                                    profit, etc
                                </li>
                                <li>Review of exclusions and inclusions</li>
                            </ul>
                        </div>
                    </div>
                    <div class="elementor-element elementor-element-867e2b0 elementor-invisible elementor-widget elementor-widget-heading"
                         data-id="867e2b0" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInLeft&quot;}"
                         data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Trusted by Contractors, Builders,
                                and Developers <span>Nationwide</span></h2></div>
                    </div>
                    <div class="elementor-element elementor-element-3dc9beb elementor-widget__width-inherit elementor-widget elementor-widget-text-editor"
                         data-id="3dc9beb" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            <p>Construct Estimates have earned the trust of contractors, builders, and developers
                                nationwide. Our commitment to accuracy, reliability, and client satisfaction has made us
                                a preferred choice for concrete estimating services. We take pride in our track record
                                of delivering results that help our clients succeed in their construction projects.</p>
                            <p><strong>Take the Next Step!</strong></p></div>
                    </div>
                    <div class="elementor-element elementor-element-ab041f5 elementor-mobile-align-center elementor-align-left elementor-widget elementor-widget-button"
                         data-id="ab041f5" data-element_type="widget" data-widget_type="button.default">
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
									<span class="elementor-button-text">Act Now and Save 30% Off</span>
					</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="elementor-element elementor-element-b958421 elementor-invisible elementor-widget elementor-widget-heading"
                         data-id="b958421" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInLeft&quot;}"
                         data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">
                                <span>Delivering Excellence </span> in Construction Projects</h2></div>
                    </div>
                    <div class="elementor-element elementor-element-01b9c4d elementor-widget__width-inherit elementor-widget elementor-widget-text-editor"
                         data-id="01b9c4d" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            <p>We take immense pride in our concrete estimating services portfolio at Construct
                                Estimates. With a proven track record of success, we have catered to various projects,
                                from <strong>large-scale dams and bridges to <a
                                            href="../residential-estimating-services/index.html">residential</a> and
                                    commercial buildings.</strong> Regarding accurate and highly detailed concrete
                                estimating services and material takeoffs, we have consistently exceeded the
                                expectations of <strong>general contractors, concrete contractors, asphalt contractors,
                                    foundation contractors, vendors, and pavers</strong>.</p></div>
                    </div>
                    <div class="elementor-element elementor-element-eeb9db3 elementor-widget elementor-widget-accordion"
                         data-id="eeb9db3" data-element_type="widget" data-widget_type="accordion.default">
                        <div class="elementor-widget-container">
                            <div class="elementor-accordion">
                                <div class="elementor-accordion-item">
                                    <h3 id="elementor-tab-title-2501" class="elementor-tab-title" data-tab="1"
                                        role="button" aria-controls="elementor-tab-content-2501" aria-expanded="false">
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
                                        <a class="elementor-accordion-title" tabindex="0">Unparalleled Accuracy and
                                            Precision for Every Project</a>
                                    </h3>
                                    <div id="elementor-tab-content-2501"
                                         class="elementor-tab-content elementor-clearfix" data-tab="1" role="region"
                                         aria-labelledby="elementor-tab-title-2501"><p>Our reputation for accuracy in
                                            the blue book and other construction directories speaks volumes about our
                                            commitment to excellence. We have completed concrete takeoff services for
                                            various private and public projects, showcasing our versatility and expertise in
                                            <strong>sidewalks, driveways, retaining walls</strong>, and concrete pavements.
                                            We have delivered detailed estimates and material takeoffs that have played a
                                            vital role in completing construction projects <strong>retaining walls,
                                                waterproofing, parking lots, flatwork, basement, concrete foundations,
                                                concrete curbs, and concrete slabs</strong>.</p></div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <h3 id="elementor-tab-title-2502" class="elementor-tab-title" data-tab="2"
                                        role="button" aria-controls="elementor-tab-content-2502" aria-expanded="false">
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
                                        <a class="elementor-accordion-title" tabindex="0">Meeting the Needs of
                                            Construction Companies, Large and Small</a>
                                    </h3>
                                    <div id="elementor-tab-content-2502"
                                         class="elementor-tab-content elementor-clearfix" data-tab="2" role="region"
                                         aria-labelledby="elementor-tab-title-2502"><p>Whether you&#8217;re a giant
                                            construction company or a minor operation, we have the expertise and resources
                                            to provide highly accurate and cost-effective concrete estimating solutions. Our
                                            comprehensive services have earned us a reputation as a reliable partner in the
                                            industry, and we continue to build trust by consistently delivering results that
                                            exceed expectations.</p></div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <h3 id="elementor-tab-title-2503" class="elementor-tab-title" data-tab="3"
                                        role="button" aria-controls="elementor-tab-content-2503" aria-expanded="false">
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
                                        <a class="elementor-accordion-title" tabindex="0">A Glimpse Into Our Concrete
                                            Estimating Services Portfolio</a>
                                    </h3>
                                    <div id="elementor-tab-content-2503"
                                         class="elementor-tab-content elementor-clearfix" data-tab="3" role="region"
                                         aria-labelledby="elementor-tab-title-2503">
                                        <ul>
                                            <li>Foundations for High-Rise Buildings</li>
                                            <li>Fences</li>
                                            <li>Residential Buildings</li>
                                            <li>Highways</li>
                                            <li>Bridges</li>
                                            <li>Commercial Buildings</li>
                                            <li>Culverts and Sewers</li>
                                            <li>Dams</li>
                                            <li>Marine Systems</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <h3 id="elementor-tab-title-2504" class="elementor-tab-title" data-tab="4"
                                        role="button" aria-controls="elementor-tab-content-2504" aria-expanded="false">
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
                                        <a class="elementor-accordion-title" tabindex="0">Your Partner for Concrete
                                            Estimating Excellence</a>
                                    </h3>
                                    <div id="elementor-tab-content-2504"
                                         class="elementor-tab-content elementor-clearfix" data-tab="4" role="region"
                                         aria-labelledby="elementor-tab-title-2504"><p>When you choose Construct
                                            Estimates for your concrete estimating needs, you partner with a team that
                                            delivers excellence. Our commitment to accuracy, reliability, and client
                                            satisfaction sets us apart in the industry. We combine our expertise, advanced
                                            software solutions, and meticulous approach to ensure our estimates meet the
                                            highest standards.</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="elementor-element elementor-element-d89c815 elementor-invisible elementor-widget elementor-widget-heading"
                         data-id="d89c815" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInLeft&quot;}"
                         data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Why <span>Outsource </span>Your
                                Concrete Estimates?
                            </h2></div>
                    </div>
                    <section
                            class="elementor-section elementor-inner-section elementor-element elementor-element-6e6653f elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                            data-id="6e6653f" data-element_type="section">
                        <div class="elementor-container elementor-column-gap-default">
                            <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-19bda67"
                                 data-id="19bda67" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-32c79c8 elementor-view-default elementor-position-top elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
                                         data-id="32c79c8" data-element_type="widget"
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
							Save Time and Resources						</span>
                                                    </h3>

                                                    <p class="elementor-icon-box-description">
                                                        Running a construction business requires undivided attention,
                                                        leaving little room for precise estimates. Our professional
                                                        estimating services allow you to focus on on-site activities
                                                        while we handle the intricate task of concrete estimation. You
                                                        no longer need to invest in expensive construction estimation
                                                        software or hire and train dedicated staff. By outsourcing to
                                                        us, you save valuable time and resources. </p>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-7a4760a"
                                 data-id="7a4760a" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-2fa9b4c elementor-view-default elementor-position-top elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
                                         data-id="2fa9b4c" data-element_type="widget"
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
							Increase Your Bid Volume and Win More Projects						</span>
                                                    </h3>

                                                    <p class="elementor-icon-box-description">
                                                        Accurate estimates are crucial for securing projects, especially
                                                        when bidding on the lowest value. With our expertise, you can
                                                        bid with precision and confidence, leading to a higher bid
                                                        volume. Outsourcing your concrete takeoffs to our experienced
                                                        team increases your chances of winning more projects and
                                                        ultimately boosts your profitability.
                                                    </p>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-eadc8f7"
                                 data-id="eadc8f7" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-042f998 elementor-view-default elementor-position-top elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
                                         data-id="042f998" data-element_type="widget"
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
							Enhance Your Estimating Efficiency						</span>
                                                    </h3>

                                                    <p class="elementor-icon-box-description">
                                                        Our expert estimators bring years of experience and knowledge to
                                                        the table. By leveraging their skills, you can improve your
                                                        estimating efficiency, resulting in more accurate cost
                                                        projections and higher profit potential. With our assistance,
                                                        you can handle missed opportunities due to flawed estimates. We
                                                        ensure you have all the information you need to make informed
                                                        decisions and secure successful projects.
                                                    </p>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div class="elementor-element elementor-element-fb96400 elementor-invisible elementor-widget elementor-widget-heading"
                         data-id="fb96400" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInLeft&quot;}"
                         data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h3 class="elementor-heading-title elementor-size-default">Benefits of Choosing <span> Construct Estimates</span>
                            </h3></div>
                    </div>
                    <div class="elementor-element elementor-element-97d6bef elementor-widget elementor-widget-accordion"
                         data-id="97d6bef" data-element_type="widget" data-widget_type="accordion.default">
                        <div class="elementor-widget-container">
                            <div class="elementor-accordion">
                                <div class="elementor-accordion-item">
                                    <div id="elementor-tab-title-1591" class="elementor-tab-title" data-tab="1"
                                         role="button" aria-controls="elementor-tab-content-1591" aria-expanded="false">
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
                                        <a class="elementor-accordion-title" tabindex="0">Highly Accurate Estimates and
                                            Material Takeoffs</a>
                                    </div>
                                    <div id="elementor-tab-content-1591"
                                         class="elementor-tab-content elementor-clearfix" data-tab="1" role="region"
                                         aria-labelledby="elementor-tab-title-1591"><p>At Construct Estimates, we pride
                                            ourselves on delivering highly accurate concrete estimates and detailed material
                                            takeoffs. Our meticulous approach ensures that every aspect of your project is
                                            noticed, providing comprehensive and reliable estimates you can rely on.</p>
                                    </div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <div id="elementor-tab-title-1592" class="elementor-tab-title" data-tab="2"
                                         role="button" aria-controls="elementor-tab-content-1592" aria-expanded="false">
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
                                        <a class="elementor-accordion-title" tabindex="0">Exceptional Turnaround
                                            Time</a>
                                    </div>
                                    <div id="elementor-tab-content-1592"
                                         class="elementor-tab-content elementor-clearfix" data-tab="2" role="region"
                                         aria-labelledby="elementor-tab-title-1592"><p>Time is of the essence in the
                                            construction industry, and we understand that. That&#8217;s why we prioritize
                                            efficiency without compromising quality. Our estimates are delivered with a
                                            lightning-fast turnaround time, typically within <strong>24 to 48</strong>
                                            hours. This delivery allows you to stay ahead of competitors and seize
                                            opportunities promptly.</p></div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <div id="elementor-tab-title-1593" class="elementor-tab-title" data-tab="3"
                                         role="button" aria-controls="elementor-tab-content-1593" aria-expanded="false">
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
                                        <a class="elementor-accordion-title" tabindex="0">Cost-Effective Solutions</a>
                                    </div>
                                    <div id="elementor-tab-content-1593"
                                         class="elementor-tab-content elementor-clearfix" data-tab="3" role="region"
                                         aria-labelledby="elementor-tab-title-1593"><p>Quality estimation services
                                            should be affordable for all contractors. Our monthly takeoff packages can save
                                            you up to <strong>50%</strong> of the expenses of hiring a full-time estimator.
                                            Construct Estimates offers top-notch services at a competitive price, maximizing
                                            your <a href="../opening-estimating-services/index.html">cost savings</a>.</p>
                                    </div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <div id="elementor-tab-title-1594" class="elementor-tab-title" data-tab="4"
                                         role="button" aria-controls="elementor-tab-content-1594" aria-expanded="false">
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
                                        <a class="elementor-accordion-title" tabindex="0">Expertise and Consultation</a>
                                    </div>
                                    <div id="elementor-tab-content-1594"
                                         class="elementor-tab-content elementor-clearfix" data-tab="4" role="region"
                                         aria-labelledby="elementor-tab-title-1594"><p>Our dedicated team of certified
                                            construction estimators, backed by reputable accreditations, is equipped with
                                            the expertise to handle various aspects of concrete estimating. Additionally, we
                                            offer <a href="../estimating-consultant/index.html">consultation services</a>
                                            regarding bid filing and managing bidding network profiles. We support you every
                                            step of the way, ensuring your success in the competitive construction industry.
                                        </p></div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <div id="elementor-tab-title-1595" class="elementor-tab-title" data-tab="5"
                                         role="button" aria-controls="elementor-tab-content-1595" aria-expanded="false">
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
                                        <a class="elementor-accordion-title" tabindex="0">24/7 Customer Support</a>
                                    </div>
                                    <div id="elementor-tab-content-1595"
                                         class="elementor-tab-content elementor-clearfix" data-tab="5" role="region"
                                         aria-labelledby="elementor-tab-title-1595"><p>We prioritize your satisfaction,
                                            so our customer support is available round the clock. Whether you have
                                            questions, need clarification, or require assistance, our friendly and
                                            knowledgeable team is always ready to help.</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="elementor-element elementor-element-dacdc18 elementor-invisible elementor-widget elementor-widget-heading"
                         data-id="dacdc18" data-element_type="widget"
                         data-settings="{&quot;_animation&quot;:&quot;fadeInLeft&quot;}"
                         data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Our
                                <span>Estimation Process</span></h2></div>
                    </div>
                    <section
                            class="elementor-section elementor-inner-section elementor-element elementor-element-feef02a elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                            data-id="feef02a" data-element_type="section">
                        <div class="elementor-container elementor-column-gap-default">
                            <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-e17194f"
                                 data-id="e17194f" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-7782909 elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-text-editor"
                                         data-id="7782909" data-element_type="widget"
                                         data-widget_type="text-editor.default">
                                        <div class="elementor-widget-container">
                                            <p>Discover how our comprehensive and transparent estimation process ensures
                                                that every aspect of your concrete project is carefully accounted for
                                                and precisely estimated.</p></div>
                                    </div>
                                    <div class="elementor-element elementor-element-7438ffb elementor-tabs-view-vertical elementor-widget__width-inherit elementor-widget elementor-widget-tabs"
                                         data-id="7438ffb" data-element_type="widget" data-widget_type="tabs.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-tabs">
                                                <div class="elementor-tabs-wrapper" role="tablist">
                                                    <div id="elementor-tab-title-1211"
                                                         class="elementor-tab-title elementor-tab-desktop-title"
                                                         aria-selected="true" data-tab="1" role="tab" tabindex="0"
                                                         aria-controls="elementor-tab-content-1211"
                                                         aria-expanded="false">Scope Identification
                                                    </div>
                                                    <div id="elementor-tab-title-1212"
                                                         class="elementor-tab-title elementor-tab-desktop-title"
                                                         aria-selected="false" data-tab="2" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1212"
                                                         aria-expanded="false">On-Screen Takeoff
                                                    </div>
                                                    <div id="elementor-tab-title-1213"
                                                         class="elementor-tab-title elementor-tab-desktop-title"
                                                         aria-selected="false" data-tab="3" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1213"
                                                         aria-expanded="false">Detailed Line Item Descriptions
                                                    </div>
                                                    <div id="elementor-tab-title-1214"
                                                         class="elementor-tab-title elementor-tab-desktop-title"
                                                         aria-selected="false" data-tab="4" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1214"
                                                         aria-expanded="false">Comprehensive Quantities
                                                    </div>
                                                    <div id="elementor-tab-title-1215"
                                                         class="elementor-tab-title elementor-tab-desktop-title"
                                                         aria-selected="false" data-tab="5" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1215"
                                                         aria-expanded="false">Concrete Formwork Considerations
                                                    </div>
                                                    <div id="elementor-tab-title-1216"
                                                         class="elementor-tab-title elementor-tab-desktop-title"
                                                         aria-selected="false" data-tab="6" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1216"
                                                         aria-expanded="false">Concrete Reinforcements
                                                    </div>
                                                    <div id="elementor-tab-title-1217"
                                                         class="elementor-tab-title elementor-tab-desktop-title"
                                                         aria-selected="false" data-tab="7" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1217"
                                                         aria-expanded="false">Labor and Equipment Costs
                                                    </div>
                                                    <div id="elementor-tab-title-1218"
                                                         class="elementor-tab-title elementor-tab-desktop-title"
                                                         aria-selected="false" data-tab="8" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1218"
                                                         aria-expanded="false">Site Preparation and Grading
                                                    </div>
                                                    <div id="elementor-tab-title-1219"
                                                         class="elementor-tab-title elementor-tab-desktop-title"
                                                         aria-selected="false" data-tab="9" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1219"
                                                         aria-expanded="false">Comprehensive Miscellaneous Costs
                                                    </div>
                                                    <div id="elementor-tab-title-12110"
                                                         class="elementor-tab-title elementor-tab-desktop-title"
                                                         aria-selected="false" data-tab="10" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-12110"
                                                         aria-expanded="false">Quality Assurance
                                                    </div>
                                                </div>
                                                <div class="elementor-tabs-content-wrapper" role="tablist"
                                                     aria-orientation="vertical">
                                                    <div class="elementor-tab-title elementor-tab-mobile-title"
                                                         aria-selected="true" data-tab="1" role="tab" tabindex="0"
                                                         aria-controls="elementor-tab-content-1211"
                                                         aria-expanded="false">Scope Identification
                                                    </div>
                                                    <div id="elementor-tab-content-1211"
                                                         class="elementor-tab-content elementor-clearfix" data-tab="1"
                                                         role="tabpanel" aria-labelledby="elementor-tab-title-1211"
                                                         tabindex="0" hidden="false"><h3>Scope Identification</h3>
                                                        <p>Our journey begins with thoroughly studying your drawing
                                                            plans. This study enables us to understand the scope of work
                                                            and align our estimations with your project&#8217;s
                                                            requirements.</p>
                                                        <p><img decoding="async"
                                                                class="alignnone wp-image-3659 size-full"
                                                                src="<?php echo $assetsUrl;?>uploads/2023/08/Scope-Identification.jpg"
                                                                alt="Concrete Estimating Services" width="1000"
                                                                height="667"
                                                                srcset="<?php echo $assetsUrl;?>uploads/2023/08/Scope-Identification.jpg 1000w, <?php echo $assetsUrl;?>uploads/2023/08/Scope-Identification-300x200.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/Scope-Identification-768x512.jpg 768w"
                                                                sizes="(max-width: 1000px) 100vw, 1000px"/></p></div>
                                                    <div class="elementor-tab-title elementor-tab-mobile-title"
                                                         aria-selected="false" data-tab="2" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1212"
                                                         aria-expanded="false">On-Screen Takeoff
                                                    </div>
                                                    <div id="elementor-tab-content-1212"
                                                         class="elementor-tab-content elementor-clearfix" data-tab="2"
                                                         role="tabpanel" aria-labelledby="elementor-tab-title-1212"
                                                         tabindex="0" hidden="hidden"><h3>On-Screen Takeoff</h3>
                                                        <p>Leveraging state-of-the-art digital software such as
                                                            Bluebeam, Planswift, and Accubid, we perform an on-screen
                                                            takeoff. This meticulous process allows us to quantify your
                                                            project&#8217;s required materials and components
                                                            accurately.</p>
                                                        <p><img loading="lazy" decoding="async"
                                                                class="aligncenter wp-image-3657 size-full"
                                                                src="<?php echo $assetsUrl;?>uploads/2023/08/Comprehensive-Quantities.jpg"
                                                                alt="Concrete Estimating Services" width="1000"
                                                                height="667"
                                                                srcset="<?php echo $assetsUrl;?>uploads/2023/08/Comprehensive-Quantities.jpg 1000w, <?php echo $assetsUrl;?>uploads/2023/08/Comprehensive-Quantities-300x200.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/Comprehensive-Quantities-768x512.jpg 768w"
                                                                sizes="(max-width: 1000px) 100vw, 1000px"/></p></div>
                                                    <div class="elementor-tab-title elementor-tab-mobile-title"
                                                         aria-selected="false" data-tab="3" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1213"
                                                         aria-expanded="false">Detailed Line Item Descriptions
                                                    </div>
                                                    <div id="elementor-tab-content-1213"
                                                         class="elementor-tab-content elementor-clearfix" data-tab="3"
                                                         role="tabpanel" aria-labelledby="elementor-tab-title-1213"
                                                         tabindex="0" hidden="hidden"><h3>Detailed Line Item
                                                            Descriptions</h3>
                                                        <p>We believe in clarity and precision. Therefore, our concrete
                                                            takeoff spreadsheets include detailed line item
                                                            descriptions, covering every element of your project, from
                                                            slabs and footings to columns and platforms.</p>
                                                        <p><img loading="lazy" decoding="async"
                                                                class="alignnone wp-image-3656 size-full"
                                                                src="<?php echo $assetsUrl;?>uploads/2023/08/Detailed-Line-Item-Descriptions.jpg"
                                                                alt="" width="1000" height="665"
                                                                srcset="<?php echo $assetsUrl;?>uploads/2023/08/Detailed-Line-Item-Descriptions.jpg 1000w, <?php echo $assetsUrl;?>uploads/2023/08/Detailed-Line-Item-Descriptions-300x200.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/Detailed-Line-Item-Descriptions-768x511.jpg 768w"
                                                                sizes="(max-width: 1000px) 100vw, 1000px"/></p></div>
                                                    <div class="elementor-tab-title elementor-tab-mobile-title"
                                                         aria-selected="false" data-tab="4" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1214"
                                                         aria-expanded="false">Comprehensive Quantities
                                                    </div>
                                                    <div id="elementor-tab-content-1214"
                                                         class="elementor-tab-content elementor-clearfix" data-tab="4"
                                                         role="tabpanel" aria-labelledby="elementor-tab-title-1214"
                                                         tabindex="0" hidden="hidden"><h3>Comprehensive Quantities</h3>
                                                        <p>Our estimations encompass various crucial aspects, such as
                                                            the amount of concrete needed, transportation costs, and the
                                                            essential equipment required. We leave no stone unturned,
                                                            factoring in elements like cranes, pumps, and mixers.</p>
                                                        <p><img loading="lazy" decoding="async"
                                                                class="alignnone wp-image-3657 size-full"
                                                                src="<?php echo $assetsUrl;?>uploads/2023/08/Comprehensive-Quantities.jpg"
                                                                alt="" width="1000" height="667"
                                                                srcset="<?php echo $assetsUrl;?>uploads/2023/08/Comprehensive-Quantities.jpg 1000w, <?php echo $assetsUrl;?>uploads/2023/08/Comprehensive-Quantities-300x200.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/Comprehensive-Quantities-768x512.jpg 768w"
                                                                sizes="(max-width: 1000px) 100vw, 1000px"/></p></div>
                                                    <div class="elementor-tab-title elementor-tab-mobile-title"
                                                         aria-selected="false" data-tab="5" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1215"
                                                         aria-expanded="false">Concrete Formwork Considerations
                                                    </div>
                                                    <div id="elementor-tab-content-1215"
                                                         class="elementor-tab-content elementor-clearfix" data-tab="5"
                                                         role="tabpanel" aria-labelledby="elementor-tab-title-1215"
                                                         tabindex="0" hidden="hidden"><h3>Concrete Formwork
                                                            Considerations</h3>
                                                        <p>Understanding the significance of formwork, we estimate the
                                                            costs associated with different types, including factors
                                                            like purchasing or renting, labor, transportation, and
                                                            repairs. We aim to provide you with a comprehensive overview
                                                            that aligns with your project goals.</p>
                                                        <p><img loading="lazy" decoding="async"
                                                                class="alignnone wp-image-3655 size-full"
                                                                src="<?php echo $assetsUrl;?>uploads/2023/08/Concrete-Formwork-Considerations.jpg"
                                                                alt="" width="1000" height="667"
                                                                srcset="<?php echo $assetsUrl;?>uploads/2023/08/Concrete-Formwork-Considerations.jpg 1000w, <?php echo $assetsUrl;?>uploads/2023/08/Concrete-Formwork-Considerations-300x200.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/Concrete-Formwork-Considerations-768x512.jpg 768w"
                                                                sizes="(max-width: 1000px) 100vw, 1000px"/></p></div>
                                                    <div class="elementor-tab-title elementor-tab-mobile-title"
                                                         aria-selected="false" data-tab="6" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1216"
                                                         aria-expanded="false">Concrete Reinforcements
                                                    </div>
                                                    <div id="elementor-tab-content-1216"
                                                         class="elementor-tab-content elementor-clearfix" data-tab="6"
                                                         role="tabpanel" aria-labelledby="elementor-tab-title-1216"
                                                         tabindex="0" hidden="hidden"><h3>Concrete Reinforcements</h3>
                                                        <p>Reinforcements play a pivotal role in ensuring structural
                                                            integrity. Our estimations cover all necessary
                                                            reinforcements, including rebar, wire mesh, stirrups,
                                                            dowels, anchors, and plastic mesh. Rest assured that every
                                                            crucial element is carefully calculated.</p>
                                                        <p><img loading="lazy" decoding="async"
                                                                class="alignnone wp-image-3652 size-full"
                                                                src="<?php echo $assetsUrl;?>uploads/2023/08/Concrete-Reinforcements.jpg"
                                                                alt="" width="1000" height="681"
                                                                srcset="<?php echo $assetsUrl;?>uploads/2023/08/Concrete-Reinforcements.jpg 1000w, <?php echo $assetsUrl;?>uploads/2023/08/Concrete-Reinforcements-300x204.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/Concrete-Reinforcements-768x523.jpg 768w"
                                                                sizes="(max-width: 1000px) 100vw, 1000px"/></p></div>
                                                    <div class="elementor-tab-title elementor-tab-mobile-title"
                                                         aria-selected="false" data-tab="7" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1217"
                                                         aria-expanded="false">Labor and Equipment Costs
                                                    </div>
                                                    <div id="elementor-tab-content-1217"
                                                         class="elementor-tab-content elementor-clearfix" data-tab="7"
                                                         role="tabpanel" aria-labelledby="elementor-tab-title-1217"
                                                         tabindex="0" hidden="hidden"><h3>Labor and Equipment Costs</h3>
                                                        <p>Labor and equipment expenses are vital to your project&#8217;s
                                                            success. By utilizing industry-leading tools like RSMeans
                                                            and our up-to-date construction cost database, we provide
                                                            accurate estimations based on the latest pricing trends and
                                                            zip code-specific data.</p>
                                                        <p><img loading="lazy" decoding="async"
                                                                class="alignnone wp-image-3654 size-full"
                                                                src="<?php echo $assetsUrl;?>uploads/2023/08/Labor-and-Equipment-Costs.jpg"
                                                                alt="" width="1000" height="667"
                                                                srcset="<?php echo $assetsUrl;?>uploads/2023/08/Labor-and-Equipment-Costs.jpg 1000w, <?php echo $assetsUrl;?>uploads/2023/08/Labor-and-Equipment-Costs-300x200.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/Labor-and-Equipment-Costs-768x512.jpg 768w"
                                                                sizes="(max-width: 1000px) 100vw, 1000px"/></p></div>
                                                    <div class="elementor-tab-title elementor-tab-mobile-title"
                                                         aria-selected="false" data-tab="8" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1218"
                                                         aria-expanded="false">Site Preparation and Grading
                                                    </div>
                                                    <div id="elementor-tab-content-1218"
                                                         class="elementor-tab-content elementor-clearfix" data-tab="8"
                                                         role="tabpanel" aria-labelledby="elementor-tab-title-1218"
                                                         tabindex="0" hidden="hidden"><h3>Site Preparation and
                                                            Grading</h3>
                                                        <p>We also factor in site preparation and grading costs
                                                            depending on your project requirements. It includes</p>
                                                        <ul>
                                                            <li>Excavation</li>
                                                            <li>Soil leveling</li>
                                                            <li>Compaction</li>
                                                            <li>Transportation</li>
                                                            <li>Equipment</li>
                                                            <li>Labor expenses.</li>
                                                        </ul>
                                                        <p><img loading="lazy" decoding="async"
                                                                class="alignnone wp-image-3651 size-full"
                                                                src="<?php echo $assetsUrl;?>uploads/2023/08/Site-Preparation-and-Grading.jpg"
                                                                alt="" width="1000" height="750"
                                                                srcset="<?php echo $assetsUrl;?>uploads/2023/08/Site-Preparation-and-Grading.jpg 1000w, <?php echo $assetsUrl;?>uploads/2023/08/Site-Preparation-and-Grading-300x225.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/Site-Preparation-and-Grading-768x576.jpg 768w"
                                                                sizes="(max-width: 1000px) 100vw, 1000px"/></p></div>
                                                    <div class="elementor-tab-title elementor-tab-mobile-title"
                                                         aria-selected="false" data-tab="9" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-1219"
                                                         aria-expanded="false">Comprehensive Miscellaneous Costs
                                                    </div>
                                                    <div id="elementor-tab-content-1219"
                                                         class="elementor-tab-content elementor-clearfix" data-tab="9"
                                                         role="tabpanel" aria-labelledby="elementor-tab-title-1219"
                                                         tabindex="0" hidden="hidden"><h3>Comprehensive Miscellaneous
                                                            Costs</h3>
                                                        <p>Our estimations go beyond the obvious, considering various
                                                            miscellaneous costs that can impact your project&#8217;s
                                                            budget. These include:</p>
                                                        <ul>
                                                            <li>Storage costs</li>
                                                            <li>Concrete testing</li>
                                                            <li>Waste management</li>
                                                            <li>Spillage prevention measures</li>
                                                            <li>Logistics, etc.</li>
                                                            <li>Additionally, we incorporate contingency funds to
                                                                address unforeseen expenses and inflation.
                                                            </li>
                                                        </ul>
                                                        <p><img loading="lazy" decoding="async"
                                                                class="alignnone wp-image-3650 size-full"
                                                                src="<?php echo $assetsUrl;?>uploads/2023/08/Comprehensive-Miscellaneous-Costs.jpg"
                                                                alt="" width="1000" height="667"
                                                                srcset="<?php echo $assetsUrl;?>uploads/2023/08/Comprehensive-Miscellaneous-Costs.jpg 1000w, <?php echo $assetsUrl;?>uploads/2023/08/Comprehensive-Miscellaneous-Costs-300x200.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/Comprehensive-Miscellaneous-Costs-768x512.jpg 768w"
                                                                sizes="(max-width: 1000px) 100vw, 1000px"/></p></div>
                                                    <div class="elementor-tab-title elementor-tab-mobile-title"
                                                         aria-selected="false" data-tab="10" role="tab" tabindex="-1"
                                                         aria-controls="elementor-tab-content-12110"
                                                         aria-expanded="false">Quality Assurance
                                                    </div>
                                                    <div id="elementor-tab-content-12110"
                                                         class="elementor-tab-content elementor-clearfix" data-tab="10"
                                                         role="tabpanel" aria-labelledby="elementor-tab-title-12110"
                                                         tabindex="0" hidden="hidden"><h3>Quality Assurance</h3>
                                                        <p>To ensure the utmost accuracy and alignment with your
                                                            expectations, our lead estimators conduct a final check,
                                                            meticulously reviewing every detail. Our commitment to
                                                            excellence drives us to deliver estimations that meet your
                                                            requirements.</p>
                                                        <p><img loading="lazy" decoding="async"
                                                                class="alignnone wp-image-3660 size-full"
                                                                src="<?php echo $assetsUrl;?>uploads/2023/08/Quality-Assurance.jpg"
                                                                alt="" width="1000" height="667"
                                                                srcset="<?php echo $assetsUrl;?>uploads/2023/08/Quality-Assurance.jpg 1000w, <?php echo $assetsUrl;?>uploads/2023/08/Quality-Assurance-300x200.jpg 300w, <?php echo $assetsUrl;?>uploads/2023/08/Quality-Assurance-768x512.jpg 768w"
                                                                sizes="(max-width: 1000px) 100vw, 1000px"/></p></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="elementor-element elementor-element-9df1575 elementor-invisible elementor-widget elementor-widget-heading"
                                         data-id="9df1575" data-element_type="widget"
                                         data-settings="{&quot;_animation&quot;:&quot;fadeInLeft&quot;}"
                                         data-widget_type="heading.default">
                                        <div class="elementor-widget-container">
                                            <h3 class="elementor-heading-title elementor-size-default">The <span>Quick and Simple</span>
                                                Method To Get Your Estimate</h3></div>
                                    </div>
                                    <div class="elementor-element elementor-element-d3b457f elementor-widget elementor-widget-text-editor"
                                         data-id="d3b457f" data-element_type="widget"
                                         data-widget_type="text-editor.default">
                                        <div class="elementor-widget-container">
                                            <p>At Construct Estimates, we understand the value of your time. That&#8217;s
                                                why we have streamlined our concrete estimating process into three easy
                                                steps, ensuring a seamless experience for our valued clients:</p></div>
                                    </div>
                                    <div class="elementor-element elementor-element-798ae98 elementor-widget elementor-widget-accordion"
                                         data-id="798ae98" data-element_type="widget"
                                         data-widget_type="accordion.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-accordion">
                                                <div class="elementor-accordion-item">
                                                    <div id="elementor-tab-title-1271" class="elementor-tab-title"
                                                         data-tab="1" role="button"
                                                         aria-controls="elementor-tab-content-1271"
                                                         aria-expanded="false">
                                                        <a class="elementor-accordion-title" tabindex="0">Submit Your
                                                            Plans/Drawings: </a>
                                                    </div>
                                                    <div id="elementor-tab-content-1271"
                                                         class="elementor-tab-content elementor-clearfix" data-tab="1"
                                                         role="region" aria-labelledby="elementor-tab-title-1271"><p>
                                                            Share your project plans and specifications here. Our team will
                                                            analyze them promptly and provide you with a quote
                                                            instantly.</p></div>
                                                </div>
                                                <div class="elementor-accordion-item">
                                                    <div id="elementor-tab-title-1272" class="elementor-tab-title"
                                                         data-tab="2" role="button"
                                                         aria-controls="elementor-tab-content-1272"
                                                         aria-expanded="false">
                                                        <a class="elementor-accordion-title" tabindex="0">Get a
                                                            Quote:</a>
                                                    </div>
                                                    <div id="elementor-tab-content-1272"
                                                         class="elementor-tab-content elementor-clearfix" data-tab="2"
                                                         role="region" aria-labelledby="elementor-tab-title-1272"><p>
                                                            Once our estimators have reviewed your plans, we will send you a
                                                            comprehensive quote. This quote will include the invoice,
                                                            turnaround time, and delivery date, enabling you to make
                                                            informed decisions swiftly. Convenient payment options,
                                                            including credit cards, debit cards, and PayPal, ensure a
                                                            hassle-free transaction.</p></div>
                                                </div>
                                                <div class="elementor-accordion-item">
                                                    <div id="elementor-tab-title-1273" class="elementor-tab-title"
                                                         data-tab="3" role="button"
                                                         aria-controls="elementor-tab-content-1273"
                                                         aria-expanded="false">
                                                        <a class="elementor-accordion-title" tabindex="0">Receive
                                                            Concrete Takeoffs:</a>
                                                    </div>
                                                    <div id="elementor-tab-content-1273"
                                                         class="elementor-tab-content elementor-clearfix" data-tab="3"
                                                         role="region" aria-labelledby="elementor-tab-title-1273"><p>
                                                            Upon accepting the quote, you will receive your concrete
                                                            takeoffs in Excel. We are flexible and can accommodate
                                                            alternative formats or MasterFormat, ensuring seamless
                                                            integration into your project management system.</p></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div class="elementor-element elementor-element-11153c2 elementor-widget elementor-widget-heading"
                         data-id="11153c2" data-element_type="widget" data-widget_type="heading.default">
                        <div class="elementor-widget-container">
                            <h2 class="elementor-heading-title elementor-size-default">Our Services Areas</h2></div>
                    </div>
                    <div class="elementor-element elementor-element-ed66692 elementor-widget__width-inherit elementor-widget elementor-widget-text-editor"
                         data-id="ed66692" data-element_type="widget" data-widget_type="text-editor.default">
                        <div class="elementor-widget-container">
                            <p>Experience our exceptional concrete estimating services in these dynamic regions, where
                                precision, reliability, and attention to detail are the cornerstones of our approach.
                                Within the Australia and United States, our exceptional services extend to various
                                vibrant markets, including:</p></div>
                    </div>
                    <div class="elementor-element elementor-element-a98b705 elementor-widget elementor-widget-accordion"
                         data-id="a98b705" data-element_type="widget" data-widget_type="accordion.default">
                        <div class="elementor-widget-container">
                            <div class="elementor-accordion">
                                <div class="elementor-accordion-item">
                                    <h3 id="elementor-tab-title-1771" class="elementor-tab-title" data-tab="1"
                                        role="button" aria-controls="elementor-tab-content-1771" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-left"
                                                          aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg
                                                                        class="e-font-icon-svg e-fas-plus"
                                                                        viewBox="0 0 448 512"
                                                                        xmlns="http://www.w3.org/2000/svg"><path
                                                                            d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-minus"
                                                                                   viewBox="0 0 448 512"
                                                                                   xmlns="http://www.w3.org/2000/svg"><path
                                                d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
														</span>
                                        <a class="elementor-accordion-title" tabindex="0">Australia</a>
                                    </h3>
                                    <div id="elementor-tab-content-1771"
                                         class="elementor-tab-content elementor-clearfix" data-tab="1" role="region"
                                         aria-labelledby="elementor-tab-title-1771">
                                        <ul>
                                            <li>New South Wales</li>
                                            <li>Victoria</li>
                                            <li>Queensland</li>
                                            <li>Western Australia</li>
                                            <li>South Australia</li>
                                            <li>Northern Territory</li>
                                            <li>Tasmania</li>
                                            <li>External Territories</li>
                                            <li>Sydney</li>
                                            <li>Melbourne</li>
                                            <li>Brisbane</li>
                                            <li>Adelaide</li>
                                            <li>Perth-Fremantle</li>
                                            <li>Darwin</li>
                                            <li>Hobart</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="elementor-accordion-item">
                                    <h3 id="elementor-tab-title-1772" class="elementor-tab-title" data-tab="2"
                                        role="button" aria-controls="elementor-tab-content-1772" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-left"
                                                          aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg
                                                                        class="e-font-icon-svg e-fas-plus"
                                                                        viewBox="0 0 448 512"
                                                                        xmlns="http://www.w3.org/2000/svg"><path
                                                                            d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-minus"
                                                                                   viewBox="0 0 448 512"
                                                                                   xmlns="http://www.w3.org/2000/svg"><path
                                                d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
														</span>
                                        <a class="elementor-accordion-title" tabindex="0">United States</a>
                                    </h3>
                                    <div id="elementor-tab-content-1772"
                                         class="elementor-tab-content elementor-clearfix" data-tab="2" role="region"
                                         aria-labelledby="elementor-tab-title-1772">
                                        <ul>
                                            <li>New York</li>
                                            <li>California</li>
                                            <li>Washington</li>
                                            <li>South Carolina</li>
                                            <li>North Carolina</li>
                                            <li>Oregon, Florida</li>
                                            <li>Oklahoma,</li>
                                            <li>Minnesota</li>
                                            <li>Tennessee</li>
                                            <li>Illinois</li>
                                            <li>Ohio</li>
                                            <li>Colorado,</li>
                                            <li>Indiana</li>
                                            <li>Kentucky</li>
                                            <li>Louisiana</li>
                                            <li>Maryland,</li>
                                            <li>Alabama</li>
                                            <li>Connecticut</li>
                                            <li>Pennsylvania</li>
                                            <li>Texas</li>
                                            <li>Georgia</li>
                                            <li>Arizona</li>
                                            <li>Michigan</li>
                                            <li>Missouri</li>
                                            <li>Massachusetts</li>
                                            <li>New Jersey</li>
                                            <li>Virginia</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php include $componentsPath . 'OurServices/RightPanel.php' ?>
        </div>
    </section>
</div>


<?php
$mainContent = ob_get_clean();
require_once $templatesPath . 'InnerPage.php';
?>

