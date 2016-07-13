<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use Illuminate\Routing\Controller;
use JanDolata\CrudeCRUD\Http\Requests\ExportRequest;
use Storage;

class ExportController extends Controller
{
    protected $csvHeaders = [
        'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
        'Content-type'        => 'text/csv',
        'Content-Disposition' => 'attachment; filename=galleries.csv',
        'Expires'             => '0',
        'Pragma'              => 'public'
    ];

    protected $csvStorageDirectory = 'crude_csv';

    public function csv(ExportRequest $request, $crudeName)
    {
        $list = $request->crude
            ->getFiltered(null, null, null, null, null, null);

        $setup = $request->crude->getCrudeSetup();
        $column = $setup->getColumnAttr();
        $list = $this->formatData($list, $column);

        $directory = $this->csvStorageDirectory;
        Storage::makeDirectory($directory);

        $fileName = $this->fileName($setup, 'csv');
        $fileUrl = storage_path('app/' . $directory . '/' . $fileName);

        $this->createCsvFile($fileUrl, $list, $this->columnNames($setup, $column));

        return response()->download($fileUrl, $fileName, $this->csvHeaders);
    }

    private function createCsvFile($url, $data, $head)
    {
        $file = fopen($url, 'w');

        fputcsv($file, $head);

        foreach ($data as $fields)
            fputcsv($file, $fields);

        fclose($file);
    }

    public function formatData($list, $column)
    {
        $data = [];
        foreach ($list as $model) {
            $item = [];
            foreach ($column as $c) {
                $item[$c] = is_array($model[$c])
                    ? count($model[$c])
                    : $model[$c];
            }
            $data[] = $item;
        }
        return $data;
    }

    private function columnNames($setup, $column)
    {
        $columnNames = [];
        $attrName = $setup->getTrans();
        foreach ($column as $c) {
            $columnNames[] = isset($attrName[$c])
                ? $attrName[$c]
                : trans('validation.attributes.' . $c);
        }
        return $columnNames;
    }

    private function fileName($setup, $extension)
    {
        return $setup->getTitle() . '_' . date("Y_m_d_H_i") . '.' . $extension;
    }

}
