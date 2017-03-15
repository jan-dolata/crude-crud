<?php
    $group['routeName'] = is_array($group['routeName']) ? $group['routeName'] : [$group['routeName']];
?>
@if(in_array($currentRouteName, $group['routeName']) && count($group['routeName']) > 1)
    @foreach ($group['routeName'] as $route)
        <small class="{{ $currentRouteName == $route ? 'active' : '' }}">
            <a href="{{ route($route) }}" class="p">
                {{ trans($routeTrans . '.' . $route) }}
            </a>
        </small>
    @endforeach
@endif
