<?php
    $group['routeName'] = is_array($group['routeName']) ? $group['routeName'] : [$group['routeName']];
?>
@if (count($group['routeName']) > 0)
    @if (count($group['routeName']) == 1)
        <li class="{{ $currentRouteName == $group['routeName'][0] ? 'active' : '' }}">
            <a href="{{ route($group['routeName'][0]) }}">
                @if ($group['icon'])
                    <i class="fa fa-{{ $group['icon'] }}"></i>
                @endif
                <span>
                    {{ trans($routeTrans . '.' . $group['routeName'][0]) }}
                </span>
            </a>
        </li>
    @else
        <li class="dropdown {{ in_array($currentRouteName, $group['routeName']) ? 'active' : '' }}">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                @if ($group['icon'])
                    <i class="fa fa-{{ $group['icon'] }}"></i>
                @endif
                {{ trans($groupTrans . '.' . $group['groupName']) }}
                <span class="caret"></span>
            </a>

            <ul class="dropdown-menu" role="menu">
                @foreach ($group['routeName'] as $route)
                    <li class="{{ $currentRouteName == $route ? 'active' : '' }}">
                        <a href="{{ route($route) }}">
                            <span>
                                {{ trans($routeTrans . '.' . $route) }}
                            </span>
                        </a>
                    </li>
                @endforeach
            </ul>
        </li>
    @endif
@endif
