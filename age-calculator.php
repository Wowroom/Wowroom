<?php
/**
 * Plugin Name: Age Calculator
 * Description: A shortcode to calculate age based on Date and Time of Birth.
 * Version: 1.0
 * Author: Your Name
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Enqueue scripts and styles
function age_calculator_enqueue_scripts() {
    // Enqueue FontAwesome (using a free CDN)
    wp_enqueue_style( 'font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', array(), '6.0.0' );

    // Enqueue plugin CSS
    wp_enqueue_style( 'age-calculator-style', plugins_url( 'css/style.css', __FILE__ ), array(), '1.0' );

    // Enqueue plugin JavaScript
    wp_enqueue_script( 'age-calculator-script', plugins_url( 'js/script.js', __FILE__ ), array( 'jquery' ), '1.0', true );

    // Pass AJAX URL to script
    wp_localize_script( 'age-calculator-script', 'ageCalculatorAjax', array(
        'ajaxurl' => admin_url( 'admin-ajax.php' )
    ) );
}
add_action( 'wp_enqueue_scripts', 'age_calculator_enqueue_scripts' );

// Shortcode function
function age_calculator_shortcode() {
    ob_start();
    ?>
    <div id="age-calculator-container">
        <div class="age-calculator-input-group">
            <label for="dob"><i class="fas fa-calendar-alt"></i> Select Date and Time of Birth:</label>
            <input type="datetime-local" id="dob" name="dob" required>
        </div>

        <button id="calculate-age-btn"><i class="fas fa-calculator"></i> Calculate Age</button>

        <div id="age-result" class="age-calculator-result">
            <p>Your Age: <span id="age-display">-- Years, -- Months, -- Days, -- Hours, -- Minutes, -- Seconds</span></p>
        </div>
        <div id="age-calculator-error" class="age-calculator-error"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'age_calculator', 'age_calculator_shortcode' );

// Basic AJAX handler (optional for this client-side calculation, but good practice)
// This function can be expanded if you need server-side validation or processing
function age_calculator_handle_ajax() {
    // You could add server-side validation here if needed
    // For this plugin, calculation is done on the client-side for real-time updates
    wp_send_json_success();
}
add_action( 'wp_ajax_calculate_age', 'age_calculator_handle_ajax' );
add_action( 'wp_ajax_nopriv_calculate_age', 'age_calculator_handle_ajax' );
?>
