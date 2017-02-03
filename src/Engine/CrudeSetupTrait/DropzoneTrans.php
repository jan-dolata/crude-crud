<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

// 2017-02-03 depreciated after InterfaceTrans added
trait DropzoneTrans
{
    protected $dropzoneTrans = '';

    public function getDropzoneTrans()
    {
        return '';
    }

    public function setDropzoneTrans($attr, $dropzoneTrans = null)
    {
        return $this;
    }
}
