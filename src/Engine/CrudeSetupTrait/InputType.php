<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait InputType
{

    /**
     * Input type - Type of add / edit form inputs
     * ['name_of_attr' => 'input_type']
     *
     * @var array
     */
    protected $inputType = [];

    /**
     * Gets the Input types.
     *
     * @return array
     */
    public function getInputType()
    {
        return $this->inputType;
    }

    /**
     * Sets the Input types.
     *
     * @param  string|array $attr
     * @param  array $value
     *
     * @return self
     */
    public function setTypes($attr, $type = null)
    {
        if (is_array($attr))
            $this->inputType = array_merge($this->inputType, $attr);
        else
            $this->inputType[$attr] = $type;

        return $this;
    }

    /**
     * Set new or change input types
     *
     * @param  string|array $types
     * @param  array $attr
     *
     * @return self
     */
    public function setTypesGroup($types, $attr = null)
    {
        if (! is_array($types))
            $types = [$types => $attr];

        foreach ($types as $type => $attrList) {
            if (! is_array($attrList))
                $attrList = [$attrList];

            foreach ($attrList as $attr)
                $this->inputType[$attr] = $type;
        }

        return $this;
    }
}
