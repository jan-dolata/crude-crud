<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait Trans
{
    /**
     * Model trans
     *
     * @var array
     */
    protected $trans = [];

    /**
     * Gets the Model trans.
     *
     * @return array
     */
    public function getTrans()
    {
        return $this->trans;
    }

    /**
     * Sets the Model trans.
     *
     * @param  string|array $attr
     * @param  array $trans = null
     *
     * @return self
     */
    public function setTrans($attr, $trans = null)
    {
        $transList = is_array($attr)
            ? $attr
            : [$attr => $trans];

        foreach ($transList as $key => $value)
            $this->trans[$key] = $value;

        return $this;
    }
}
