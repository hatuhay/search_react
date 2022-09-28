<?php

namespace Drupal\search_react\Controller;

use Drupal\Core\Link;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Url;
use Drupal\node\NodeInterface;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;      
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Class SearchController.
 */
class SearchController extends ControllerBase {

  /**
   * Render search.
   *
   * @return string
   *   Return Hello string.
   */
  public function searchPage() {
    global $base_url;
    return [
      '#type' => 'markup',
      '#markup' => '<div id="root"></div>',
      '#attached' => [
        'library' => [
          'search_react/app',
        ],
        'drupalSettings' => [
          'searchReact' => [
            'url' => $base_url,
            'country' => self::getTerms('cit_countries_information'),
            'language' => self::getTerms('document_language'),
            'process' => self::getTerms('document_process'),
            'substance' => self::getTerms('document_substance'),
            'intro' => self::renderBlock('block_content:f3500eb9-f6ac-4435-8b08-b3284bfe5b50'),
          ],
        ],
      ],
    ];
  }

  protected function getTerms($vid) {
    $query = \Drupal::entityQuery('taxonomy_term');
    $query->condition('vid', $vid);
    $query->sort('name');
    $tids = $query->execute();
    $terms = Term::loadMultiple($tids);
    $output = [];
    foreach($terms as $tid => $term) {
      $output[] = [
        'tid' => $tid,
        'name' => $term->getName(),
      ];
    }
    return $output;
  }

  protected function renderBlock($bid) {
    $block = \Drupal::service('plugin.manager.block')->createInstance($bid, []);
    $render = $block->build();
    $renderer = \Drupal::service('renderer');
    return $renderer->renderPlain($render);
  }

}
