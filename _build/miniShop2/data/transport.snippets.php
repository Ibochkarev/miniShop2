<?php
/**
 * Add snippets to build
 * 
 * @package minishop2
 * @subpackage build
 */
$snippets = array();

$tmp = array(
	'msProducts' => 'ms_products'
	,'msCart' => 'ms_cart'
	,'msMiniCart' => 'ms_minicart'
	,'msGallery' => 'ms_gallery'
	,'msOptions' => 'ms_options'
	,'msOrder' => 'ms_order'
	,'msGetOrder' => 'ms_get_order'
);

foreach ($tmp as $k => $v) {
	/* @avr modSnippet $snippet */
	$snippet = $modx->newObject('modSnippet');
	$snippet->fromArray(array(
		'id' => 0
		,'name' => $k
		,'description' => ''
		,'snippet' => getSnippetContent($sources['source_core'].'/elements/snippets/snippet.'.$v.'.php')
		,'static' => BUILD_SNIPPET_STATIC
		,'source' => 1
		,'static_file' => 'core/components/minishop2/elements/snippets/snippet.'.$v.'.php'
	),'',true,true);

	$properties = include $sources['build'].'properties/properties.'.$v.'.php';
	$snippet->setProperties($properties);

	$snippets[] = $snippet;
}

unset($properties);
return $snippets;
