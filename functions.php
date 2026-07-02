<?php
/**
 * FBF Starter — Hello Elementor child theme
 *
 * Reusable, de-branded framework scaffold. Per-project identity (theme name,
 * fonts, handle prefix) is stamped from .env by `npm run init` — see README.
 * The parent theme (hello-elementor) handles core Hello Elementor / Elementor
 * Pro integration; this file adds enqueues, a shortcode registry, an Elementor
 * customizer fix, and a scroll-shadow helper.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ── Project config (stamped by scripts/init.mjs from .env) ───────────────────
if ( ! defined( 'THEME_HANDLE_PREFIX' ) ) {
	define( 'THEME_HANDLE_PREFIX', 'theme' );
}
if ( ! defined( 'THEME_GOOGLE_FONTS_URL' ) ) {
	// init writes the project's GOOGLE_FONTS_URL here; empty string disables it.
	define( 'THEME_GOOGLE_FONTS_URL', '' );
}

// ── Includes ─────────────────────────────────────────────────────────────────
require_once get_stylesheet_directory() . '/lib/custom-functions.php';
require_once get_stylesheet_directory() . '/inc/shortcodes.php';

// ── Enqueue parent stylesheet ─────────────────────────────────────────────────
add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style(
		THEME_HANDLE_PREFIX . '-parent-style',
		get_template_directory_uri() . '/style.css'
	);
} );

// ── Google Fonts (optional; URL stamped from .env) ─────────────────────────────
add_action( 'wp_enqueue_scripts', function () {
	if ( '' === THEME_GOOGLE_FONTS_URL ) {
		return;
	}
	wp_enqueue_style(
		THEME_HANDLE_PREFIX . '-fonts',
		THEME_GOOGLE_FONTS_URL,
		[],
		null
	);
}, 5 );

// ── Compiled child-theme CSS (main.css) ────────────────────────────────────────
add_action( 'wp_enqueue_scripts', function () {

	$dir = get_stylesheet_directory();

	// Compiled child-theme CSS — tokens + base + components. Source: scss/
	// (build with `npm run build:css`). Tokens are single-sourced there.
	wp_enqueue_style(
		THEME_HANDLE_PREFIX . '-main',
		get_stylesheet_directory_uri() . '/assets/css/main.css',
		[],
		file_exists( $dir . '/assets/css/main.css' ) ? filemtime( $dir . '/assets/css/main.css' ) : null
	);

}, 15 );

// ── Fix: Elementor library widget fatal in WP customizer (PHP 8 + E4.x) ────────
// Elementor\Controls_Stack::sanitize_settings() has a typed array param; in the
// customizer context the widget passes a raw JSON string, causing a TypeError.
// Unregistering the widget there is safe — the customizer is not used on an
// Elementor-only site.
add_action( 'customize_register', function () {
	global $wp_widget_factory;
	$widget_class = 'ElementorPro\Modules\Library\WP_Widgets\Elementor_Library';
	if ( isset( $wp_widget_factory->widgets[ $widget_class ] ) ) {
		unregister_widget( $widget_class );
	}
}, 20 );

// ── Scroll shadow: toggle body class at scrollY > 8px ──────────────────────────
add_action( 'wp_footer', function () {
	?>
<script>
(function () {
  'use strict';
  var ticking = false;
  function update() {
    document.body.classList.toggle('body-scrolled', window.scrollY > 8);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}());
</script>
	<?php
}, 20 );
