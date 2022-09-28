<?php
/**
 * @file
 * Contains \Drupal\search_react\Plugin\Block\SearchBlock.
 */

namespace Drupal\search_react\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormInterface;

/**
 * Provides a 'react_search' block.
 *
 * @Block(
 *   id = "react_search_block",
 *   admin_label = @Translation("Search block"),
 *   category = @Translation("Custom search block")
 * )
 */
class SearchBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    $form = \Drupal::formBuilder()->getForm('Drupal\search_react\Form\SearchForm');

    return $form;
   }
}