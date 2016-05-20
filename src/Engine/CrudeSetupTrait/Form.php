<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait Form
{

    /**
     * Model attributes for add form
     *
     * @var array
     */
    protected $addForm = [];

    /**
     * Model attributes for add form
     *
     * @var array
     */
    protected $editForm = [];


    /**
     * Gets the Model attributes for add form.
     *
     * @return array
     */
    public function getAddForm()
    {
        return $this->addForm;
    }

    /**
     * Sets the Model attributes for add form.
     *
     * @param array $addForm the add form
     *
     * @return self
     */
    public function setAddForm(array $addForm)
    {
        $this->addForm = $addForm;

        return $this;
    }

    /**
     * Gets the Model attributes for add form.
     *
     * @return array
     */
    public function getEditForm()
    {
        return $this->editForm;
    }

    /**
     * Sets the Model attributes for add form.
     *
     * @param array $editForm the edit form
     *
     * @return self
     */
    public function setEditForm(array $editForm)
    {
        $this->editForm = $editForm;

        return $this;
    }

    /**
     * Sets the Model attributes for add form and edit form.
     *
     * @param array $form the edit form
     *
     * @return self
     */
    public function setAddAndEditForm($form)
    {
        return $this
            ->setAddForm($form)
            ->setEditForm($form);
    }
}
