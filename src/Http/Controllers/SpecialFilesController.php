<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use JanDolata\CrudeCRUD\Engine\Helpers\CrudeSpecialFiles;
use JanDolata\CrudeCRUD\Http\Requests\Request;

class SpecialFilesController extends BaseController
{

    public function upload(Request $request, $name)
    {
        if ($request->file('file'))
            (new CrudeSpecialFiles)->upload($request->file('file'), $name);
        
        return back();
    }

    public function download($name)
    {
        $downloadData = (new CrudeSpecialFiles)->downloadData($name);

        return $downloadData
            ? response()->download($downloadData['path'], $downloadData['name'])
            : back();
    }
}
