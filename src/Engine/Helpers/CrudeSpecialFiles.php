<?php

namespace JanDolata\CrudeCRUD\Engine\Helpers;

use Illuminate\Support\Facades\Storage;

class CrudeSpecialFiles
{

    /**
     * Get information about all files (key, label, data)
     *
     * @return array
     */
    public function getList()
    {
        $result = [];
        foreach (config('crude_special_files.files') as $key)
            $result[$key] = [
                'key' => $key,
                'label' => $this->getLabel($key),
                'data' => $this->getFileData($key)
            ];

        return $result;
    }

    /**
     * Get download params: path and name
     *
     * @param  string $key
     * @return array
     */
    public function downloadData($key)
    {
        $fileData = $this->getFileData($key);

        if (! $fileData)
            return false;

        return [
            'path' => $fileData['path'],
            'name' => $this->getLabel($key) . '.' . $fileData['extension']
        ];
    }

    /**
     * Upload file if exist and key is correct
     *
     * @param  File $file
     * @param  string $key
     */
    public function upload($file, $key)
    {
        if (! $file || ! $this->isValidKey($key))
            return;

        $fileName = $file->getClientOriginalName();
        $pathinfo = pathinfo($fileName);

        $this->deleteStored($key);

        Storage::putFileAs($this->getStoragePath(), $file, $key . '.' . $pathinfo['extension']);
    }

    /**
     * Helpers -----------------------------------------------------------------
     */

    /**
     * Get file path and extension or null if file is not stored
     *
     * @param  string $key
     * @return array|false
     */
    private function getFileData($key)
    {
        foreach ($this->getStoredList() as $filePath) {

            $pathinfo = pathinfo($filePath);

            if ($key == $pathinfo['filename'])
                return [
                    'storedPath' => $filePath,
                    'path' => storage_path('app/' . $filePath),
                    'extension' => $pathinfo['extension'],
                    'size' => Storage::size($filePath),
                    'lastModified' => Storage::lastModified($filePath)
                ];
        }

        return false;
    }

    /**
     * Get paths of all stored files
     *
     * @return array
     */
    private function getStoredList()
    {
        return Storage::files($this->getStoragePath());
    }

    /**
     * Delete stored files by key
     *
     * @param  string $key
     */
    private function deleteStored($key)
    {
        while ($file = $this->getFileData($key))
            Storage::delete($file['storedPath']);
    }

    /**
     * Check is key in $fileKeys
     *
     * @param  string $key
     * @return boolean
     */
    private function isValidKey($key)
    {
        return in_array($key, config('crude_special_files.files'));
    }

    /**
     * Get label by key
     *
     * @param  string $key
     * @return string
     */
    private function getLabel($key)
    {
        return trans(config('crude_special_files.trans') . '.' . $key);
    }

    /**
     * Get sorage path
     *
     * @return string
     */
    private function getStoragePath()
    {
        return './' . config('crude_special_files.storage');
    }

}
