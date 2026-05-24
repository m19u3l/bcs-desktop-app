<?php
define('DS', "/");
define('DocRoot', $_SERVER['DOCUMENT_ROOT'].DS);
include DocRoot.'AdminPanel'.DS.'Includes'.DS.'Index.php';

/**
 * @var string $templatesPath
 * @var string $baseUrl
 * @var string $assetsUrl
 * @var string $assetsPath
 * @var string $componentsPath
 */

$inPageCssPath = $assetsPath.'CSS'.DS.'GetAQuote'.DS.'InPageCss.php';
$pageTitle = "Get A Quote";
$breadcrumbs = [
    ['title' => 'Home', 'link' => $baseUrl],
    ['title' => $pageTitle, 'link' => ''],
];
$hideFooterTop = true;
ob_start();

?>
<div data-elementor-type="wp-page" data-elementor-id="300" class="elementor elementor-300"
     data-elementor-post-type="page">
    <?php include $componentsPath . 'InnerPageHeading.php' ?>
    <div class="elementor-element elementor-element-da95975 e-flex e-con-boxed e-con e-parent" data-id="da95975" data-element_type="container">
        <div class="e-con-inner">
            <div class="elementor-element elementor-element-b8bf63b e-con-full e-flex e-con e-child" data-id="b8bf63b" data-element_type="container">
                <div class="elementor-element elementor-element-e36c1dc e-con-full e-flex e-con e-child" data-id="e36c1dc" data-element_type="container">
                    <div class="elementor-element elementor-element-c16c033 e-con-full e-flex e-con e-child" data-id="c16c033" data-element_type="container">
                        <div class="elementor-element elementor-element-ca3721d elementor-widget elementor-widget-heading" data-id="ca3721d" data-element_type="widget" data-widget_type="heading.default">
                            <div class="elementor-widget-container">
                                <h2 class="elementor-heading-title elementor-size-default">Get Your Estimation Within  <span>24/48 </span>Hours</h2>				</div>
                        </div>
                        <div class="elementor-element elementor-element-afb1234 elementor-widget elementor-widget-heading" data-id="afb1234" data-element_type="widget" data-widget_type="heading.default">
                            <div class="elementor-widget-container">
                                <p class="elementor-heading-title elementor-size-default">Special Limited Time Offer: 30% Off for New Clients!</p>				</div>
                        </div>
                        <div class="elementor-element elementor-element-5750a26 elementor-widget__width-inherit elementor-widget elementor-widget-text-editor" data-id="5750a26" data-element_type="widget" data-widget_type="text-editor.default">
                            <div class="elementor-widget-container">
                                <p>Getting your construction estimate from Construct Estimates is quick and easy. Simply fill out the form below with the required fields:</p>								</div>
                        </div>
                    </div>
                </div>
                <div class="elementor-element elementor-element-43fa2d7 e-con-full e-flex e-con e-child" data-id="43fa2d7" data-element_type="container">
                    <div class="elementor-element elementor-element-b9cd975 e-con-full e-flex e-con e-child" data-id="b9cd975" data-element_type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                        <div class="elementor-element elementor-element-37c4719 elementor-widget elementor-widget-heading" data-id="37c4719" data-element_type="widget" data-widget_type="heading.default">
                            <div class="elementor-widget-container">
                                <h2 class="elementor-heading-title elementor-size-default">Get Estimate</h2>				</div>
                        </div>
                        <div class="elementor-element elementor-element-3596f97 elementor-widget__width-inherit elementor-widget elementor-widget-text-editor" data-id="3596f97" data-element_type="widget" data-widget_type="text-editor.default">
                            <div class="elementor-widget-container">
                                <p>Have a query or need immediate assistance?<br />Feel free to reach out to us through any of the<br />following channels:</p>								</div>
                        </div>
                        <div class="elementor-element elementor-element-7091cae elementor-position-left elementor-mobile-position-left elementor-view-default elementor-vertical-align-top elementor-widget elementor-widget-icon-box" data-id="7091cae" data-element_type="widget" data-widget_type="icon-box.default">
                            <div class="elementor-widget-container">
                                <div class="elementor-icon-box-wrapper">

                                    <div class="elementor-icon-box-icon">
				<span  class="elementor-icon elementor-animation-">
				<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46" fill="none"><circle cx="23" cy="23" r="23" fill="white" fill-opacity="0.15"></circle><path d="M28 14.5H18C15 14.5 13 16 13 19.5V26.5C13 30 15 31.5 18 31.5H28C31 31.5 33 30 33 26.5V19.5C33 16 31 14.5 28 14.5ZM28.47 20.59L25.34 23.09C24.68 23.62 23.84 23.88 23 23.88C22.16 23.88 21.31 23.62 20.66 23.09L17.53 20.59C17.21 20.33 17.16 19.85 17.41 19.53C17.67 19.21 18.14 19.15 18.46 19.41L21.59 21.91C22.35 22.52 23.64 22.52 24.4 21.91L27.53 19.41C27.85 19.15 28.33 19.2 28.58 19.53C28.84 19.85 28.79 20.33 28.47 20.59Z" fill="white"></path></svg>				</span>
                                    </div>

                                    <div class="elementor-icon-box-content">

                                        <h5 class="elementor-icon-box-title">
						<span  >
							Email						</span>
                                        </h5>

                                        <p class="elementor-icon-box-description">
                                            <a href="mailto:info@elementorthemesite.com">info@elementorthemesite.com</a>					</p>

                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="elementor-element elementor-element-0669708 elementor-position-left elementor-mobile-position-left elementor-view-default elementor-vertical-align-top elementor-widget elementor-widget-icon-box" data-id="0669708" data-element_type="widget" data-widget_type="icon-box.default">
                            <div class="elementor-widget-container">
                                <div class="elementor-icon-box-wrapper">

                                    <div class="elementor-icon-box-icon">
				<span  class="elementor-icon elementor-animation-">
				<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46" fill="none"><circle cx="23" cy="23" r="23" fill="white" fill-opacity="0.2"></circle><path d="M22.05 25.95L20.2 27.8C19.81 28.19 19.19 28.19 18.79 27.81C18.68 27.7 18.57 27.6 18.46 27.49C17.43 26.45 16.5 25.36 15.67 24.22C14.85 23.08 14.19 21.94 13.71 20.81C13.24 19.67 13 18.58 13 17.54C13 16.86 13.12 16.21 13.36 15.61C13.6 15 13.98 14.44 14.51 13.94C15.15 13.31 15.85 13 16.59 13C16.87 13 17.15 13.06 17.4 13.18C17.66 13.3 17.89 13.48 18.07 13.74L20.39 17.01C20.57 17.26 20.7 17.49 20.79 17.71C20.88 17.92 20.93 18.13 20.93 18.32C20.93 18.56 20.86 18.8 20.72 19.03C20.59 19.26 20.4 19.5 20.16 19.74L19.4 20.53C19.29 20.64 19.24 20.77 19.24 20.93C19.24 21.01 19.25 21.08 19.27 21.16C19.3 21.24 19.33 21.3 19.35 21.36C19.53 21.69 19.84 22.12 20.28 22.64C20.73 23.16 21.21 23.69 21.73 24.22C21.83 24.32 21.94 24.42 22.04 24.52C22.44 24.91 22.45 25.55 22.05 25.95Z" fill="white"></path><path d="M32.9701 29.33C32.9701 29.61 32.9201 29.9 32.8201 30.18C32.7901 30.26 32.7601 30.34 32.7201 30.42C32.5501 30.78 32.3301 31.12 32.0401 31.44C31.5501 31.98 31.0101 32.37 30.4001 32.62C30.3901 32.62 30.3801 32.63 30.3701 32.63C29.7801 32.87 29.1401 33 28.4501 33C27.4301 33 26.3401 32.76 25.1901 32.27C24.0401 31.78 22.8901 31.12 21.7501 30.29C21.3601 30 20.9701 29.71 20.6001 29.4L23.8701 26.13C24.1501 26.34 24.4001 26.5 24.6101 26.61C24.6601 26.63 24.7201 26.66 24.7901 26.69C24.8701 26.72 24.9501 26.73 25.0401 26.73C25.2101 26.73 25.3401 26.67 25.4501 26.56L26.2101 25.81C26.4601 25.56 26.7001 25.37 26.9301 25.25C27.1601 25.11 27.3901 25.04 27.6401 25.04C27.8301 25.04 28.0301 25.08 28.2501 25.17C28.4701 25.26 28.7001 25.39 28.9501 25.56L32.2601 27.91C32.5201 28.09 32.7001 28.3 32.8101 28.55C32.9101 28.8 32.9701 29.05 32.9701 29.33Z" fill="white"></path></svg>				</span>
                                    </div>

                                    <div class="elementor-icon-box-content">

                                        <h5 class="elementor-icon-box-title">
						<span  >
							Call us						</span>
                                        </h5>

                                        <p class="elementor-icon-box-description">
                                            <a href="tel:7372733314">737 273-3314</a><br>
                                            <a href="tel:0488620354">(048) 862-0354</a>					</p>

                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="elementor-element elementor-element-729cca0 elementor-position-left elementor-mobile-position-left elementor-view-default elementor-vertical-align-top elementor-widget elementor-widget-icon-box" data-id="729cca0" data-element_type="widget" data-widget_type="icon-box.default">
                            <div class="elementor-widget-container">
                                <div class="elementor-icon-box-wrapper">

                                    <div class="elementor-icon-box-icon">
				<span  class="elementor-icon elementor-animation-">
				<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46" fill="none"><circle cx="23" cy="23" r="23" fill="white" fill-opacity="0.2"></circle><g clip-path="url(#clip0_108_1036)"><path d="M31.6201 19.45C30.5701 14.83 26.5401 12.75 23.0001 12.75C23.0001 12.75 23.0001 12.75 22.9901 12.75C19.4601 12.75 15.4201 14.82 14.3701 19.44C13.2001 24.6 16.3601 28.97 19.2201 31.72C20.2801 32.74 21.6401 33.25 23.0001 33.25C24.3601 33.25 25.7201 32.74 26.7701 31.72C29.6301 28.97 32.7901 24.61 31.6201 19.45ZM23.0001 24.46C21.2601 24.46 19.8501 23.05 19.8501 21.31C19.8501 19.57 21.2601 18.16 23.0001 18.16C24.7401 18.16 26.1501 19.57 26.1501 21.31C26.1501 23.05 24.7401 24.46 23.0001 24.46Z" fill="white"></path></g><defs><clipPath id="clip0_108_1036"><rect width="24" height="24" fill="white" transform="translate(11 11)"></rect></clipPath></defs></svg>				</span>
                                    </div>

                                    <div class="elementor-icon-box-content">

                                        <h5 class="elementor-icon-box-title">
						<span  >
							Address:						</span>
                                        </h5>

                                        <p class="elementor-icon-box-description">
                                            <span><img decoding="async" src="<?php echo $assetsUrl; ?>uploads/2023/08/circle.svg">USA Office:</span>
                                            <a>2000 Taylor St, Houston, TX 77007, United States</a>
                                            <br><img decoding="async" src="<?php echo $assetsUrl; ?>uploads/2023/08/australia.svg">Australia Office<br>
                                        <p>100 Barangaroo, Sydney NSW 2000</p>					</p>

                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="elementor-element elementor-element-e0e2c92 elementor-position-left elementor-mobile-position-left elementor-view-default elementor-vertical-align-top elementor-widget elementor-widget-icon-box" data-id="e0e2c92" data-element_type="widget" data-widget_type="icon-box.default">
                            <div class="elementor-widget-container">
                                <div class="elementor-icon-box-wrapper">

                                    <div class="elementor-icon-box-icon">
				<span  class="elementor-icon elementor-animation-">
				<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46" fill="none"><circle cx="23" cy="23" r="23" fill="white" fill-opacity="0.2"></circle><path d="M23 13C17.49 13 13 17.49 13 23C13 28.51 17.49 33 23 33C28.51 33 33 28.51 33 23C33 17.49 28.51 13 23 13ZM27.35 26.57C27.21 26.81 26.96 26.94 26.7 26.94C26.57 26.94 26.44 26.91 26.32 26.83L23.22 24.98C22.45 24.52 21.88 23.51 21.88 22.62V18.52C21.88 18.11 22.22 17.77 22.63 17.77C23.04 17.77 23.38 18.11 23.38 18.52V22.62C23.38 22.98 23.68 23.51 23.99 23.69L27.09 25.54C27.45 25.75 27.57 26.21 27.35 26.57Z" fill="white"></path></svg>				</span>
                                    </div>

                                    <div class="elementor-icon-box-content">

                                        <h5 class="elementor-icon-box-title">
						<span  >
							Working Hours:						</span>
                                        </h5>

                                        <p class="elementor-icon-box-description">
                                            Mon-Sat: 9 AM – 10 PM					</p>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="elementor-element elementor-element-877f182 e-con-full e-flex e-con e-child" data-id="877f182" data-element_type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                        <div class="elementor-element elementor-element-d53e216 elementor-widget elementor-widget-heading" data-id="d53e216" data-element_type="widget" data-widget_type="heading.default">
                            <div class="elementor-widget-container">
                                <h2 class="elementor-heading-title elementor-size-default">Get In Touch</h2>				</div>
                        </div>
                        <div class="elementor-element elementor-element-fbdad35 elementor-widget__width-inherit elementor-widget elementor-widget-text-editor" data-id="fbdad35" data-element_type="widget" data-widget_type="text-editor.default">
                            <div class="elementor-widget-container">
                                Fill the below form to resolve any queries or to ask for estimation.
                            </div>
                        </div>
                        <?php if (isset($validationErrorMessage) && $validationErrorMessage !== '') : ?>
                            <div class="alert-box">
                                <span class="alert-text"><?php echo $validationErrorMessage; ?></span>
                            </div>
                        <?php endif; ?>

                        <?php if (isset($validationSuccessMessage) && $validationSuccessMessage !== '') : ?>
                            <div class="success-box">
                                <span class="success-text"><?php echo $validationSuccessMessage; ?></span>
                            </div>
                        <?php endif; ?>
                        <div class="elementor-element elementor-element-b8d4a12 elementor-button-align-start elementor-widget elementor-widget-form" data-id="b8d4a12" data-element_type="widget" data-settings="{&quot;step_next_label&quot;:&quot;Next&quot;,&quot;step_previous_label&quot;:&quot;Previous&quot;,&quot;button_width&quot;:&quot;100&quot;,&quot;step_type&quot;:&quot;number_text&quot;,&quot;step_icon_shape&quot;:&quot;circle&quot;}" data-widget_type="form.default">
                            <div class="elementor-widget-container">
                                <form method="post" action="" enctype="multipart/form-data">
                                    <div class="elementor-form-fields-wrapper elementor-labels-above">
                                        <div class="elementor-field-type-text elementor-field-group elementor-column elementor-field-group-name elementor-col-50 elementor-field-required elementor-mark-required">
                                            <label for="form-field-name" class="elementor-field-label">
                                                Your Name							</label>
                                            <input size="1" type="text" name="affordable_estimate_name" id="form-field-name" class="elementor-field elementor-size-sm  elementor-field-textual" placeholder="Name" required="required" aria-required="true">
                                        </div>
                                        <div class="elementor-field-type-text elementor-field-group elementor-column elementor-field-group-field_2e4220d elementor-col-50">
                                            <label for="form-field-field_2e4220d" class="elementor-field-label">
                                                Your Company							</label>
                                            <input size="1" type="text" name="affordable_estimate_company" id="form-field-field_2e4220d" class="elementor-field elementor-size-sm  elementor-field-textual" placeholder="Company Name here..">
                                        </div>
                                        <div class="elementor-field-type-email elementor-field-group elementor-column elementor-field-group-email elementor-col-50 elementor-field-required elementor-mark-required">
                                            <label for="form-field-email" class="elementor-field-label">
                                                Your Email							</label>
                                            <input size="1" type="email" name="affordable_estimate_email" id="form-field-email" class="elementor-field elementor-size-sm  elementor-field-textual" placeholder="Email..." required="required" aria-required="true">
                                        </div>
                                        <div class="elementor-field-type-tel elementor-field-group elementor-column elementor-field-group-field_75bbc2e elementor-col-50 elementor-field-required elementor-mark-required">
                                            <label for="form-field-field_75bbc2e" class="elementor-field-label">
                                                Your Cell							</label>
                                            <input size="1" type="tel" name="affordable_estimate_phone" id="form-field-field_75bbc2e" class="elementor-field elementor-size-sm  elementor-field-textual" placeholder="Cell..." required="required" aria-required="true" pattern="[0-9()#&amp;+*-=.]+" title="Only numbers and phone characters (#, -, *, etc) are accepted.">

                                        </div>
                                        <div class="elementor-field-type-upload elementor-field-group elementor-column elementor-field-group-message elementor-col-100">
                                            <label for="form-field-message" class="elementor-field-label">
                                                Upload File Max file 2MB (Contact us via contact page for larger pictures)							</label>
                                            <input type="file" name="affordable_estimate_file" id="form-field-message" class="elementor-field elementor-size-sm  elementor-upload-field">

                                        </div>
                                        <div class="elementor-field-type-url elementor-field-group elementor-column elementor-field-group-field_f5e5d74 elementor-col-100">
                                            <label for="form-field-field_f5e5d74" class="elementor-field-label">
                                                Plans Url							</label>
                                            <input size="1" type="url" name="affordable_estimate_plans_url" id="form-field-field_f5e5d74" class="elementor-field elementor-size-sm  elementor-field-textual" placeholder="www.plansurl.com">
                                        </div>
                                        <div class="elementor-field-type-select elementor-field-group elementor-column elementor-field-group-field_466fc00 elementor-col-100">
                                            <label for="form-field-field_466fc00" class="elementor-field-label">
                                                Type							</label>
                                            <div class="elementor-field elementor-select-wrapper remove-before ">
                                                <div class="select-caret-down-wrapper">
                                                    <svg aria-hidden="true" class="e-font-icon-svg e-eicon-caret-down" viewBox="0 0 571.4 571.4" xmlns="http://www.w3.org/2000/svg"><path d="M571 393Q571 407 561 418L311 668Q300 679 286 679T261 668L11 418Q0 407 0 393T11 368 36 357H536Q550 357 561 368T571 393Z"></path></svg>			</div>
                                                <select name="affordable_estimate_type" id="form-field-field_466fc00" class="elementor-field-textual elementor-size-sm">
                                                    <option value="Full Scope">Full Scope</option>
                                                    <option value="Specific Trade">Specific Trade</option>
                                                    <option value="Paint Job">Paint Job</option>
                                                    <option value="Concrete Job">Concrete Job</option>
                                                    <option value="Structure Work">Structure Work</option>
                                                    <option value="Electric Work">Electric Work</option>
                                                    <option value="Plumber">Plumber</option>
                                                    <option value="Brick Work">Brick Work</option>
                                                    <option value="Bid Management Services">Bid Management Services</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="elementor-field-type-textarea elementor-field-group elementor-column elementor-field-group-field_c3db8c2 elementor-col-100">
                                            <textarea class="elementor-field-textual elementor-field  elementor-size-sm" name="affordable_estimate_desc_scope" id="form-field-field_c3db8c2" rows="3" placeholder="Type Description/Scope here"></textarea>				</div>

                                        <div class="elementor-field-group elementor-column elementor-field-type-submit elementor-col-100 e-form__buttons">
                                            <button name="affordable_estimate_submit" class="elementor-button elementor-size-sm" type="submit">
						<span class="elementor-button-content-wrapper">
															<span class="elementor-button-icon">
									<svg xmlns="http://www.w3.org/2000/svg" width="32" height="15" viewBox="0 0 32 15" fill="none"><circle cx="7.5" cy="7.5" r="7" stroke="#0163BE"></circle><path d="M31.3536 8.35355C31.5488 8.15829 31.5488 7.84171 31.3536 7.64645L28.1716 4.46447C27.9763 4.2692 27.6597 4.2692 27.4645 4.46447C27.2692 4.65973 27.2692 4.97631 27.4645 5.17157L30.2929 8L27.4645 10.8284C27.2692 11.0237 27.2692 11.3403 27.4645 11.5355C27.6597 11.7308 27.9763 11.7308 28.1716 11.5355L31.3536 8.35355ZM7 8.5H31V7.5H7V8.5Z" fill="#0163BE"></path></svg>																	</span>
																						<span class="elementor-button-text">Submit</span>
													</span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <section class="elementor-section elementor-top-section elementor-element elementor-element-40fc26a elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="40fc26a" data-element_type="section">
        <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-43943d2" data-id="43943d2" data-element_type="column">
                <div class="elementor-widget-wrap elementor-element-populated">
                    <section class="elementor-section elementor-inner-section elementor-element elementor-element-0bfd596 elementor-section-content-middle elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="0bfd596" data-element_type="section">
                        <div class="elementor-container elementor-column-gap-default">
                            <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-ec56e16" data-id="ec56e16" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-428226c elementor-widget__width-initial elementor-widget elementor-widget-heading" data-id="428226c" data-element_type="widget" data-widget_type="heading.default">
                                        <div class="elementor-widget-container">
                                            <h2 class="elementor-heading-title elementor-size-default">Benefits You Get with Construct <span>Estimates?</span></h2>				</div>
                                    </div>
                                </div>
                            </div>
                            <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-19da8d9" data-id="19da8d9" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-96a2227 elementor-widget__width-inherit elementor-widget elementor-widget-text-editor" data-id="96a2227" data-element_type="widget" data-widget_type="text-editor.default">
                                        <div class="elementor-widget-container">
                                            Construct Estimates is here to provide you with accurate and detailed construction cost estimates that will exceed your expectations. With years of experience and a team of expert estimators, we guarantee error-free estimates tailored to your specific needs. Whether you require commercial, residential, or industrial construction estimates, we&#8217;ve got you covered!								</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="elementor-section elementor-inner-section elementor-element elementor-element-e4e51c1 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="e4e51c1" data-element_type="section">
                        <div class="elementor-container elementor-column-gap-default">
                            <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-164e0ce" data-id="164e0ce" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-527d6b4 elementor-widget elementor-widget-image" data-id="527d6b4" data-element_type="widget" data-widget_type="image.default">
                                        <div class="elementor-widget-container">
                                            <img decoding="async" width="558" height="486" src="<?php echo $assetsUrl; ?>uploads/2023/08/Rectangle-4488-13-1.png" class="attachment-full size-full wp-image-2755" alt="Construction site" srcset="<?php echo $assetsUrl; ?>uploads/2023/08/Rectangle-4488-13-1.png 558w, <?php echo $assetsUrl; ?>uploads/2023/08/Rectangle-4488-13-1-300x261.png 300w" sizes="(max-width: 558px) 100vw, 558px" />															</div>
                                    </div>
                                </div>
                            </div>
                            <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-9a2c17b" data-id="9a2c17b" data-element_type="column">
                                <div class="elementor-widget-wrap elementor-element-populated">
                                    <div class="elementor-element elementor-element-c7a2361 elementor-widget elementor-widget-accordion" data-id="c7a2361" data-element_type="widget" data-widget_type="accordion.default">
                                        <div class="elementor-widget-container">
                                            <div class="elementor-accordion">
                                                <div class="elementor-accordion-item">
                                                    <div id="elementor-tab-title-2091" class="elementor-tab-title" data-tab="1" role="button" aria-controls="elementor-tab-content-2091" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-right" aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg class="e-font-icon-svg e-fas-chevron-down" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-chevron-up" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg></span>
														</span>
                                                        <a class="elementor-accordion-title" tabindex="0">Comprehensive Analysis</a>
                                                    </div>
                                                    <div id="elementor-tab-content-2091" class="elementor-tab-content elementor-clearfix" data-tab="1" role="region" aria-labelledby="elementor-tab-title-2091"><p>Upload your detailed plans, blueprints, or drawings, and let our team provide you with a comprehensive analysis of your project costs. No more guesswork or uncertainties &#8211; we give you the information you need to make informed decisions. Say goodbye to unexpected costs and unwelcome surprises.</p></div>
                                                </div>
                                                <div class="elementor-accordion-item">
                                                    <div id="elementor-tab-title-2092" class="elementor-tab-title" data-tab="2" role="button" aria-controls="elementor-tab-content-2092" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-right" aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg class="e-font-icon-svg e-fas-chevron-down" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-chevron-up" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg></span>
														</span>
                                                        <a class="elementor-accordion-title" tabindex="0">Precise and Quality Estimates</a>
                                                    </div>
                                                    <div id="elementor-tab-content-2092" class="elementor-tab-content elementor-clearfix" data-tab="2" role="region" aria-labelledby="elementor-tab-title-2092"><p>At Construct Estimates, precision and quality are our top priorities. We utilize premium and modern software, such as <strong>Fast PIPE, Fast DUCT, Blue beam, and more,</strong> to ensure precise and accurate estimations. Don&#8217;t just take our word for it &#8211; check out our samples on our website or contact us for our portfolio</p></div>
                                                </div>
                                                <div class="elementor-accordion-item">
                                                    <div id="elementor-tab-title-2093" class="elementor-tab-title" data-tab="3" role="button" aria-controls="elementor-tab-content-2093" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-right" aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg class="e-font-icon-svg e-fas-chevron-down" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-chevron-up" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg></span>
														</span>
                                                        <a class="elementor-accordion-title" tabindex="0">Quick Turnaround Time</a>
                                                    </div>
                                                    <div id="elementor-tab-content-2093" class="elementor-tab-content elementor-clearfix" data-tab="3" role="region" aria-labelledby="elementor-tab-title-2093"><p>We understand the importance of efficiency in the construction industry. With our efficient and qualified estimators, we strive to deliver your estimate within 24-48 hours working days. However, for more complex projects, the delivery may take up to 4-5 days. It’s better to get a custom quotation on delivery time!</p></div>
                                                </div>
                                                <div class="elementor-accordion-item">
                                                    <div id="elementor-tab-title-2094" class="elementor-tab-title" data-tab="4" role="button" aria-controls="elementor-tab-content-2094" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-right" aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg class="e-font-icon-svg e-fas-chevron-down" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-chevron-up" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg></span>
														</span>
                                                        <a class="elementor-accordion-title" tabindex="0">Incomplete Drawings</a>
                                                    </div>
                                                    <div id="elementor-tab-content-2094" class="elementor-tab-content elementor-clearfix" data-tab="4" role="region" aria-labelledby="elementor-tab-title-2094"><p>No Problem: Worried about incomplete drawings? Our team of highly skilled and qualified estimators can handle early-stage projects with precision and accuracy. You can trust us to provide you with reliable estimates, even with incomplete information.</p></div>
                                                </div>
                                                <div class="elementor-accordion-item">
                                                    <div id="elementor-tab-title-2095" class="elementor-tab-title" data-tab="5" role="button" aria-controls="elementor-tab-content-2095" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-right" aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg class="e-font-icon-svg e-fas-chevron-down" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-chevron-up" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg></span>
														</span>
                                                        <a class="elementor-accordion-title" tabindex="0">Custom Quotations</a>
                                                    </div>
                                                    <div id="elementor-tab-content-2095" class="elementor-tab-content elementor-clearfix" data-tab="5" role="region" aria-labelledby="elementor-tab-title-2095"><p>Every project comes with its unique challenges. That&#8217;s why we offer custom quotations based on your specific work and requirements. Call us on our UAN +1 (737) 273-3314, and our friendly team will provide you with a personalized pricing estimate.</p></div>
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
require_once $templatesPath.'InnerPage.php';
?>

