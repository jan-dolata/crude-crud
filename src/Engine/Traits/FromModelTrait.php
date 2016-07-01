<?php

namespace JanDolata\CrudeCRUD\Engine\Traits;

use JanDolata\CrudeCRUD\Engine\CrudeSetup;

trait FromModelTrait
{
    use \JanDolata\CrudeCRUD\Engine\Traits\FromModelTraitPart\ModelTrait;
    use \JanDolata\CrudeCRUD\Engine\Traits\FromModelTraitPart\OrderTrait;
    use \JanDolata\CrudeCRUD\Engine\Traits\FromModelTraitPart\StoreUpdateDeleteTrait;
    use \JanDolata\CrudeCRUD\Engine\Traits\FromModelTraitPart\CollectionTrait;
}
