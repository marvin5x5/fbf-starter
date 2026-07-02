<?php
/**
 * Shortcodes — small, guarded registry.
 *
 * Prefer Elementor Dynamic Tags for ACF / Site Settings values. These exist
 * only for the few places a value must sit inside raw markup (text/HTML
 * widgets, template strings) where a Dynamic Tag cannot reach.
 *
 * Common names are wrapped in shortcode_exists() so a plugin that already
 * registers them wins and we do not fatal.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * [current_year] — current year, e.g. footer copyright:
 *   © [current_year] Company Name
 */
if ( ! shortcode_exists( 'current_year' ) ) {
	add_shortcode( 'current_year', function () {
		return esc_html( wp_date( 'Y' ) );
	} );
}

/**
 * [site_email] — contact email, scrambled against harvesters via antispambot().
 * Reads the ACF Options "email" field when present, else the site admin email.
 *
 * Attributes:
 *   link="1"    wrap the address in a mailto: link (default: plain text)
 *   class="..." class applied to the link when link="1"
 */
if ( ! shortcode_exists( 'site_email' ) ) {
	add_shortcode( 'site_email', function ( $atts ) {
		$atts = shortcode_atts( [
			'link'  => '',
			'class' => '',
		], $atts, 'site_email' );

		$email = function_exists( 'get_field' ) ? get_field( 'email', 'option' ) : '';
		if ( ! $email ) {
			$email = get_option( 'admin_email' );
		}
		if ( ! is_email( $email ) ) {
			return '';
		}

		$display = antispambot( $email );
		if ( ! $atts['link'] ) {
			return $display;
		}

		$class = $atts['class'] ? ' class="' . esc_attr( $atts['class'] ) . '"' : '';
		return '<a href="mailto:' . antispambot( $email ) . '"' . $class . '>' . $display . '</a>';
	} );
}

/**
 * [site_option name="field_name"] — output a scalar ACF Options field in raw
 * markup. Escape hatch only; use an Elementor Dynamic Tag where possible.
 */
if ( ! shortcode_exists( 'site_option' ) ) {
	add_shortcode( 'site_option', function ( $atts ) {
		$atts = shortcode_atts( [ 'name' => '' ], $atts, 'site_option' );

		if ( ! $atts['name'] || ! function_exists( 'get_field' ) ) {
			return '';
		}

		$value = get_field( $atts['name'], 'option' );
		return is_scalar( $value ) ? esc_html( $value ) : '';
	} );
}
