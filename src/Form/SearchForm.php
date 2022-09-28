<?php
/**
 * @file
 * Contains \Drupal\search_react\Form\SearchForm.
 */
namespace Drupal\search_react\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\URL;
use Symfony\Component\HttpFoundation\RedirectResponse;

class SearchForm extends FormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'react_search_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form['wrapper'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => [
          'd-flex',
        ],
      ],
    ];
    $form['wrapper']['search_string'] = [
      '#type' => 'textfield',
      '#required' => TRUE,
      '#size' => 20,
    ];

    $form['wrapper']['actions']['#type'] = 'actions';
    $form['wrapper']['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Search'),
      '#button_type' => 'primary',
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $search_string = $form_state->getValue('search_string');
    $response = new RedirectResponse(URL::fromUserInput("/constitutions/document_library", ['query' => ['search' => $search_string]])->toString());
    $response->send();
    return;
  }
}