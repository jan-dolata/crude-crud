<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait DropzoneTrans
{
    /**
     * Model trans
     *
     * @var array
     */
    protected $dropzoneTrans = [];

    /**
     * Gets the Model dropzoneTrans.
     *
     * @return array
     */
    public function getDropzoneTrans()
    {
        return $this->dropzoneTrans;
    }

    /**
     * Sets the Model dropzoneTrans.
     *
     * @param  string|array $attr
     * @param  array $dropzoneTrans = null
     *
     * @return self
     */
    public function setDropzoneTrans($attr, $dropzoneTrans = null)
    {
        $transList = is_array($attr)
            ? $attr
            : [$attr => $dropzoneTrans];

        foreach ($transList as $key => $value)
            $this->dropzoneTrans[$key] = $value;

        return $this;
    }
}
